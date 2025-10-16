// app/models/index.js
import mongoose from "mongoose";
// import dbConfig from "../config/db.config.js";
 const localURI = process.env.MONGODB_LOCAL;
const atlasURI = process.env.MONGODB_URI;
import User from "./user.model.js";
import Role from "./role.model.js";
 
const db = {};
 
db.mongoose = mongoose;
db.User = User;
db.Role = Role;
 
db.ROLES = ["user", "admin", "moderator"];
db.config = localURI;
 
export default db;