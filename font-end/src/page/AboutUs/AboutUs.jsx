import React, { useState } from 'react';

const About = () => {


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
           
           
           
        </div>
    );
}

export default About;
