// app/controllers/user.controller.js
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
};
 
export const userBoard = (req, res) => {
    res.status(200).send("User Content.");
};
 
export const moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
};
 
export const adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
};

// Get current user profile
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate('roles', 'name')
            .select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email, phone, currentPassword, newPassword } = req.body;
        
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

     
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }

    
        if (name && name !== user.name) {
            const existingUser = await User.findOne({ name });
            if (existingUser) {
                return res.status(400).json({ message: 'Username already in use' });
            }
            user.name = name;
        }
 if (typeof phone !== 'undefined') {
      // ví dụ validate đơn giản (tuỳ region)
      const p = String(phone).trim();
      if (p && !/^[0-9+\-\s()]{6,20}$/.test(p)) {
        return res.status(400).json({ message: 'Invalid phone number format' });
      }
      user.phone = p; // 👈 CẬP NHẬT PHONE
    }

  

        // Update password if provided
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Current password is required' });
            }
            
            const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Current password is incorrect' });
            }
            
            user.password = bcrypt.hashSync(newPassword, 8);
        }

        await user.save();
        
        const updatedUser = await User.findById(user._id)
            .populate('roles', 'name')
            .select('-password');
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user avatar/profile picture
export const updateAvatar = async (req, res) => {
    try {
        const { avatarURL } = req.body;
        
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.avatarURL = avatarURL;
        await user.save();
        
        const updatedUser = await User.findById(user._id)
            .populate('roles', 'name')
            .select('-password');
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};