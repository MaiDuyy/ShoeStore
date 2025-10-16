import { GoogleGenAI } from "@google/genai";
import axios from 'axios';
import API_URLS from '../config/config';

const ai = new GoogleGenAI({ apiKey: "AIzaSyAgPKhELQiclppacmLQKFsufNh8b6xuz2M" });

// Context đơn giản về giày
// const shoeContext = `Bạn là một trợ lý AI chuyên về giày. Bạn chỉ được phép trả lời dựa trên thông tin giày có trong cơ sở dữ liệu của cửa hàng.
// Khi trả lời, bạn cần:
// 1. Chỉ đề cập đến các sản phẩm có trong danh sách
// 2. Nêu rõ tên sản phẩm, giá, thương hiệu và các thông tin liên quan
// 3. Nếu không tìm thấy sản phẩm phù hợp, hãy thông báo rõ ràng
// 4. Giữ câu trả lời ngắn gọn và chính xác`;
const shoeContext = `Bạn là một trợ lý bán hàng chuyên nghiệp, có khả năng tư vấn khách hàng về sản phẩm giày dựa trên thông tin cụ thể và chi tiết.
Khi tư vấn, bạn cần:
1. Chỉ đề cập đến các sản phẩm có trong danh sách được cung cấp
2. Nêu rõ tên sản phẩm, giá, thương hiệu và các thông tin liên quan
3. Nếu không tìm thấy sản phẩm phù hợp, hãy thông báo rõ ràng và gợi ý các sản phẩm thay thế
4. Giữ câu trả lời ngắn gọn, chính xác và thân thiện
5. Nếu có nhiều sản phẩm phù hợp, hãy sắp xếp theo mức độ phù hợp nhất
6. Luôn nhấn mạnh các ưu điểm và đặc điểm nổi bật của sản phẩm`;

// Cache để lưu trữ danh sách giày
let shoesCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 phút

async function getShoesList() {
  try {
    // Kiểm tra cache
    if (shoesCache && lastFetchTime && (Date.now() - lastFetchTime < CACHE_DURATION)) {
      return shoesCache;
    }

    const response = await axios.get(API_URLS.GET_PRODUCTS);
    shoesCache = response.data;
    lastFetchTime = Date.now();
    return shoesCache;
  } catch (error) {
    console.error("Error fetching shoes:", error);
    return [];
  }
}

// Hàm tìm kiếm giày theo loại
function searchShoesByCategory(shoes, category) {
  if (!category || !shoes) return [];
  
  const categoryTerm = category.toLowerCase().trim();
  return shoes.filter(shoe => {
    const shoeCategory = shoe.category?.toLowerCase() || '';
    return shoeCategory.includes(categoryTerm);
  });
}

// Hàm tìm kiếm giày theo hãng
function searchShoesByBrand(shoes, brand) {
  if (!brand || !shoes) return [];
  
  const brandTerm = brand.toLowerCase().trim();
  return shoes.filter(shoe => {
    const shoeBrand = shoe.brand?.toLowerCase() || '';
    return shoeBrand.includes(brandTerm);
  });
}

// Hàm tìm kiếm giày được tối ưu
function searchShoes(shoes, query) {
  if (!query || !shoes) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  // Kiểm tra nếu query là tìm theo loại
  if (searchTerm.startsWith('loại') || searchTerm.startsWith('dòng')) {
    const category = searchTerm.replace(/^(loại|dòng)\s+/, '').trim();
    return searchShoesByCategory(shoes, category);
  }
  
  // Kiểm tra nếu query là tìm theo hãng
  if (searchTerm.startsWith('hãng') || searchTerm.startsWith('thương hiệu')) {
    const brand = searchTerm.replace(/^(hãng|thương hiệu)\s+/, '').trim();
    return searchShoesByBrand(shoes, brand);
  }
  
  return shoes.filter(shoe => {
    const name = shoe.shoes_name?.toLowerCase() || '';
    const brand = shoe.brand?.toLowerCase() || '';
    const category = shoe.category?.toLowerCase() || '';
    const description = shoe.description?.toLowerCase() || '';
    
    return name.includes(searchTerm) || 
           brand.includes(searchTerm) || 
           category.includes(searchTerm) || 
           description.includes(searchTerm);
  });
}

export async function askShoeQuestion(question) {
  try {
    const shoes = await getShoesList();
    const searchResults = searchShoes(shoes, question);
    
    // Tạo thông tin giày cho prompt
    let shoeInfo = "";
    if (searchResults.length > 0) {
      // Kiểm tra loại tìm kiếm
      const isCategorySearch = question.toLowerCase().startsWith('loại') || 
                             question.toLowerCase().startsWith('dòng');
      const isBrandSearch = question.toLowerCase().startsWith('hãng') || 
                           question.toLowerCase().startsWith('thương hiệu');
      
      if (isCategorySearch) {
        const category = question.toLowerCase().replace(/^(loại|dòng)\s+/, '').trim();
        shoeInfo = `Các sản phẩm thuộc loại ${category}:\n`;
        
      } else if (isBrandSearch) {
        const brand = question.toLowerCase().replace(/^(hãng|thương hiệu)\s+/, '').trim();
        shoeInfo = `Các sản phẩm của hãng ${brand}:\n`;
      } else {
        shoeInfo = "Các sản phẩm tìm thấy:\n";
      }
      
      searchResults.forEach(shoe => {
        shoeInfo += `- ${shoe.shoes_name}\n`;
        shoeInfo += `  Giá: ${shoe.sale_price} USD\n`;
        shoeInfo += `  Thương hiệu: ${shoe.brand}\n`;
        shoeInfo += `  Loại: ${shoe.category}\n`;
     
        if (shoe.description) {
          shoeInfo += `  Mô tả: ${shoe.description}\n`;
        }
        if (shoe.original_price) {
          shoeInfo += `  Giá gốc: ${shoe.original_price} USD\n`;
        }
        if (shoe.discount) {
          shoeInfo += `  Giảm giá: ${shoe.discount}%\n`;
        }
        shoeInfo += '\n';
      });
    } else {
      // Phân tích câu hỏi để tìm từ khóa chính
      const keywords = question.toLowerCase().split(' ');
      const brandKeywords = ['nike', 'adidas', 'puma', 'converse', 'vans', 'new balance', 'asics'];
      const categoryKeywords = ['chạy bộ' === "Running", 'bóng đá'=== 'Football', 'tennis', 'basketball', 'lifestyle', 'sneaker'];
      
      let suggestedBrands = brandKeywords.filter(brand => 
        !keywords.some(keyword => keyword.includes(brand))
      );
      
      let suggestedCategories = categoryKeywords.filter(category => 
        !keywords.some(keyword => keyword.includes(category))
      );
      
      shoeInfo = "Xin chào! Tôi hiểu bạn đang tìm kiếm sản phẩm giày. ";
      
      if (suggestedBrands.length > 0) {
        shoeInfo += `\nBạn có thể thử tìm kiếm với các thương hiệu khác như: ${suggestedBrands.slice(0, 3).join(', ')}.`;
      }
      
      if (suggestedCategories.length > 0) {
        shoeInfo += `\nHoặc các loại giày khác như: ${suggestedCategories.slice(0, 3).join(', ')}.`;
      }
      
      shoeInfo += "\n\nBạn có thể:";
      shoeInfo += "\n1. Thử tìm kiếm với từ khóa khác";
      shoeInfo += "\n2. Xem tất cả sản phẩm trong danh mục";
      shoeInfo += "\n3. Liên hệ với nhân viên tư vấn để được hỗ trợ";
      shoeInfo += "\n4. Để lại thông tin để được tư vấn khi có sản phẩm phù hợp";
    }

    const prompt = `${shoeContext}\n\nDanh sách sản phẩm:\n${shoeInfo}\n\nCâu hỏi của khách hàng: ${question}`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt
    });
    
    // Chuẩn bị dữ liệu cho product cards
    const productCards = searchResults.map(shoe => ({
      id: shoe.id,
      name: shoe.shoes_name,
      price: shoe.sale_price,
      brand: shoe.brand,
      category: shoe.category,
      description: shoe.description,
      originalPrice: shoe.original_price,
      discount: shoe.discount
    }));
    
    return {
      success: true,
      answer: response.text,
      shoes: searchResults,
      productCards: productCards
    };
  } catch (error) {
    console.error("Error in shoe AI:", error);
    return {
      success: false,
      error: "Có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại sau.",
      productCards: []
    };
  }
}

// Ví dụ sử dụng
// const question = "Tìm cho tôi giày Nike chạy bộ";
// const answer = await askShoeQuestion(question);
// console.log(answer);