const cloudinary = require("../config/cloudinary");
const productImageModel = require("../models/productImageModel");
const productModel = require("../models/productModel");

// Helper function to stream buffer to Cloudinary
const uploadBufferToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "inventory_products",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Helper function to extract public_id if not stored in DB (backward compatibility)
const extractPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/upload/")[1];
    const withoutVersion = parts.replace(/^v\d+\//, "");
    const publicId = withoutVersion.substring(0, withoutVersion.lastIndexOf("."));
    return publicId;
  } catch (error) {
    return null;
  }
};

// POST /api/products/:id/images
const uploadImage = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await productModel.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required under form-data key 'image'",
      });
    }

    // Upload to Cloudinary
    const cloudResult = await uploadBufferToCloudinary(req.file.buffer);

    // Save URL and public_id to MySQL
    const imageId = await productImageModel.addProductImage(
      productId,
      cloudResult.secure_url,
      cloudResult.public_id
    );

    const savedImage = await productImageModel.getImageById(imageId);

    res.status(201).json({
      success: true,
      message: "Image uploaded and linked successfully",
      data: savedImage,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id/images
const getProductImages = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const product = await productModel.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const images = await productImageModel.getImagesByProductId(productId);

    res.status(200).json({
      success: true,
      message: "Product images retrieved successfully",
      data: images,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/images/:imageId
// Replaces an existing image: Deletes old from Cloudinary, uploads new, updates DB
const updateImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    const existingImage = await productImageModel.getImageById(imageId);
    if (!existingImage) {
      return res.status(404).json({
        success: false,
        message: "Product image not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "New image file is required under form-data key 'image'",
      });
    }

    // 1. Delete old asset from Cloudinary
    const targetPublicId =
      existingImage.publicId || extractPublicIdFromUrl(existingImage.imageUrl);
    if (targetPublicId) {
      await cloudinary.uploader.destroy(targetPublicId);
    }

    // 2. Upload new replacement image
    const cloudResult = await uploadBufferToCloudinary(req.file.buffer);

    // 3. Update database record
    await productImageModel.updateProductImage(
      imageId,
      cloudResult.secure_url,
      cloudResult.public_id
    );

    const updatedImage = await productImageModel.getImageById(imageId);

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      data: updatedImage,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/images/:imageId
const deleteImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    const imageRecord = await productImageModel.getImageById(imageId);
    if (!imageRecord) {
      return res.status(404).json({
        success: false,
        message: "Product image record not found",
      });
    }

    // 1. Delete from Cloudinary
    const targetPublicId =
      imageRecord.publicId || extractPublicIdFromUrl(imageRecord.imageUrl);
    if (targetPublicId) {
      await cloudinary.uploader.destroy(targetPublicId);
    }

    // 2. Delete from MySQL
    await productImageModel.deleteProductImage(imageId);

    res.status(200).json({
      success: true,
      message: "Product image deleted from Cloudinary and database successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  getProductImages,
  updateImage,
  deleteImage,
};