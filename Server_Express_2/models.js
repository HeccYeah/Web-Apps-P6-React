const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  Role: { type: String, required: true },
  catalog_year: { type: String, required: true },
  first_name: { type: String, required: true },
  is_male: { type: String, required: true },
  last_name: { type: String, required: true },
  password: { type: String, required: true },
  s_id: { type: String, required: true },
  savior: { type: String, required: true },
  username: { type: String, required: true },
  plans: [{type: mongoose.Schema.Types.ObjectId, ref: "Plan" }]
}, { collection: "user"});

// Define the plan schema
const planSchema = new mongoose.Schema({
  is_default: { type: String, required: true },
  owner_id: { type: String, required: true },
  p_id: { type: String, required: true },
  p_name: { type: String, required: true },
  has_courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HasCourse' }]
}, { collection: "plan"});

// Define the has_course schema
const hasCourseSchema = new mongoose.Schema({
  p_id: { type: String, required: true },
  c_id: { type: String, required: true },
  sem: { type: String, required: true },
  year: { type: String, required: true },
  school_year: { type: String, required: true },
  // Other fields for has_course collection
}, { collection: "has_course"});

// Export the schemas
module.exports = {
  User: mongoose.model('User', userSchema),
  Plan: mongoose.model('Plan', planSchema),
  HasCourse: mongoose.model('HasCourse', hasCourseSchema),
};
