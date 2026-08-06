// import {
//   User,
//   CorpsMemberProfile,
//   Announcement,
//   Accommodation,
//   Business,
//   ScamReport,
//   CommunityPost,
// } from "../models/index.js";


// // User Management 


// export const getAllUsers = async () => {
//   return User.findAll({
//     attributes: { exclude: ["password"] },
//   });
// };

// export const getUserById = async (userId) => {
//   const user = await User.findByPk(userId, {
//     attributes: { exclude: ["password"] },
//     include: [{ model: CorpsMemberProfile, as: "profile" }],
//   });

//   if (!user) {
//     throw new Error(`No user found for ID: ${userId}`);
//   }

//   return user;
// };

// export const deleteUser = async (userId) => {
//   const user = await User.findByPk(userId);

//   if (!user) {
//     throw new Error(`No user found for ID: ${userId}`);
//   }

//   await user.destroy();
//   return { userId };
// };


// // Accommodation verification       


// export const getAccommodations = async (status) => {
//   const where = status ? { verificationStatus: status } : {};
//   return Accommodation.findAll({
//     where,
//     include: [{ model: User, as: "landlord", attributes: ["id", "fullName", "email"] }],
//   });
// };

// export const verifyAccommodation = async (accommodationId, decision, rejectionReason) => {
//   const accommodation = await Accommodation.findByPk(accommodationId);

//   if (!accommodation) {
//     throw new Error(`No accommodation found for ID: ${accommodationId}`);
//   }

//   if (!["VERIFIED", "REJECTED"].includes(decision)) {
//     throw new Error('Decision must be "VERIFIED" or "REJECTED".');
//   }

//   accommodation.verificationStatus = decision;
//   accommodation.rejectionReason = decision === "REJECTED" ? rejectionReason || null : null;
//   await accommodation.save();

//   return accommodation;
// };


// // Business approval


// export const getBusinesses = async (status) => {
//   const where = status ? { approvalStatus: status } : {};
//   return Business.findAll({
//     where,
//     include: [{ model: User, as: "owner", attributes: ["id", "fullName", "email"] }],
//   });
// };

// export const approveBusiness = async (businessId, decision, rejectionReason) => {
//   const business = await Business.findByPk(businessId);

//   if (!business) {
//     throw new Error(`No business found for ID: ${businessId}`);
//   }

//   if (!["APPROVED", "REJECTED"].includes(decision)) {
//     throw new Error('Decision must be "APPROVED" or "REJECTED".');
//   }

//   business.approvalStatus = decision;
//   business.rejectionReason = decision === "REJECTED" ? rejectionReason || null : null;
//   await business.save();

//   return business;
// };


// // Scam reports


// export const getScamReports = async (status) => {
//   const where = status ? { status } : {};
//   return ScamReport.findAll({
//     where,
//     include: [
//       { model: User, as: "reporter", attributes: ["id", "fullName", "email"] },
//       { model: User, as: "resolver", attributes: ["id", "fullName", "email"] },
//     ],
//     order: [["createdAt", "DESC"]],
//   });
// };

// export const resolveScamReport = async (reportId, adminUserId, decision, adminNote) => {
//   const report = await ScamReport.findByPk(reportId);

//   if (!report) {
//     throw new Error(`No scam report found for ID: ${reportId}`);
//   }

//   if (!["RESOLVED", "DISMISSED"].includes(decision)) {
//     throw new Error('Decision must be "RESOLVED" or "DISMISSED".');
//   }

//   report.status = decision;
//   report.adminNote = adminNote || null;
//   report.resolvedById = adminUserId;
//   await report.save();

//   return report;
// };

// // Announcement

// export const createAnnouncement = async (adminUserId, title, body) => {
//   if (!title || !body) {
//     throw new Error("Both title and body are required.");
//   }

//   return Announcement.create({
//     title,
//     body,
//     publishedBy: adminUserId,
//   });
// };

// export const getAnnouncements = async () => {
//   return Announcement.findAll({
//     where: { isPublished: true },
//     include: [{ model: User, as: "publisher", attributes: ["id", "fullName"] }],
//     order: [["createdAt", "DESC"]],
//   });
// };

// export const deleteAnnouncement = async (announcementId) => {
//   const announcement = await Announcement.findByPk(announcementId);

//   if (!announcement) {
//     throw new Error(`No announcement found for ID: ${announcementId}`);
//   }

//   await announcement.destroy();
//   return { announcementId };
// };


// // Community content moderation


// export const getFlaggedPosts = async () => {
//   return CommunityPost.findAll({
//     where: { isFlagged: true, isRemoved: false },
//     include: [{ model: User, as: "author", attributes: ["id", "fullName", "email"] }],
//     order: [["createdAt", "DESC"]],
//   });
// };

// export const moderatePost = async (postId, action, removalReason) => {
//   const post = await CommunityPost.findByPk(postId);

//   if (!post) {
//     throw new Error(`No post found for ID: ${postId}`);
//   }

//   if (!["APPROVE", "REMOVE"].includes(action)) {
//     throw new Error('Action must be "APPROVE" or "REMOVE".');
//   }

//   if (action === "REMOVE") {
//     post.isRemoved = true;
//     post.removalReason = removalReason || null;
//   } else {
//     post.isFlagged = false;
//   }

//   await post.save();
//   return post;
// };