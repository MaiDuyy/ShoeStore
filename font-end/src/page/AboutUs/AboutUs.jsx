import React, { useState } from 'react';

const About = () => {

    const [teamMembers] = useState([
        { name: 'Lê Vũ Thanh Dương', img: 'https://placehold.co/200x230', studentCode: '22643441' },
        { name: 'Nguyễn Nhật Dương', img: 'https://placehold.co/200x230', studentCode: '22639261' },
        { name: 'Phạm Mai Duy', img: 'https://placehold.co/200x230', studentCode: '22002115' },
        { name: 'Phan Tấn Duy', img: 'https://placehold.co/200x230', studentCode: '22678601' },
        { name: 'Nguyễn Quỳnh Gia', img: 'https://placehold.co/200x230', studentCode: 'Chi tiết về Nguyễn Quỳnh Gia.' }
    ]);

    const [selectedMember, setSelectedMember] = useState(null);

    const handleMemberClick = (member) => {
        setSelectedMember(member);
    };

    const closeDetails = () => {
        setSelectedMember(null);
    };

    return (
        <div className='container mx-auto p-5'>
            <div className="flex justify-center">
                <h1 className='text-4xl font-bold text-center'>About Us</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-5">
                <div>
                    <h1 className='text-2xl font-bold py-2'>OUR PURPOSE</h1>
                    <p className='text-justify'>
                        Our purpose, ‘Through sport, we have the power to change lives,’ guides the way we run our company, how we work with our partners, how we create our products, and how we engage with our consumers. We will always strive to expand the boundaries of human possibility, to include and unite people in sport, and to create a more sustainable world.
                    </p>
                </div>
                <div>
                    <img src="https://res.cloudinary.com/confirmed-web/image/upload/c_lfill,w_1000/v1705910723/adidas-group/images/purpose_en_zs9gg0.jpg" alt="Our Purpose" className="w-full object-cover" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-5">
                <div>
                    <img src="https://res.cloudinary.com/confirmed-web/image/upload/c_lfill,w_1000/v1710174644/adidas-group/images/2024/Misson-en-03-2024_x6irvw.png" alt="Our Mission" className="w-full object-cover" />
                </div>
                <div>
                    <h1 className='text-2xl font-bold py-2'>OUR MISSION</h1>
                    <p className='text-justify'>
                        Athletes do not settle for average. And neither do we. We have a clear mission: To be the best sports brand in the world. Every day, we come to work to create and sell the best sports products in the world, and to offer the best service and consumer experience – and to do it all in a sustainable way. We are the best when we are the credible, inclusive, and sustainable leader in our industry.
                    </p>
                </div>
            </div>
            <div className="py-5">
                <h2 className="text-2xl font-bold text-center">ALL MEMBER</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 py-5">
                {teamMembers.map((member, index) => (
                    <div
                        className="card border p-3 cursor-pointer hover:shadow-lg"
                        key={index}
                        onClick={() => handleMemberClick(member)}
                    >
                        <img src={member.img} alt={member.name} className="w-full mb-2" />
                        <h3 className='text-center text-lg font-bold'>{member.name}</h3>
                    </div>
                ))}
            </div>
            {selectedMember && (
                <div
                    className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
                    onClick={closeDetails}
                >
                    <div
                        className="bg-white p-5 rounded shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h5 className="text-xl font-bold text-center">Thông tin chi tiết</h5>
                        <div className="flex flex-col md:flex-row items-center gap-5">
                            <img src={selectedMember.img} alt={selectedMember.name} className="w-40 h-40 object-cover" />
                            <div>
                                <h3 className='text-lg font-bold'>{selectedMember.name}</h3>
                                <p>MSSV: {selectedMember.studentCode}</p>
                            </div>
                        </div>
                        <button type="button" className="mt-5 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700" onClick={closeDetails}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default About;
