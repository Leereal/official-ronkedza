"use server";
import { auth } from "@clerk/nextjs";
import { handleError } from "../utils";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
    secretAccessKey: process.env.AWS_BUCKET_SECRET_ACCESS_KEY,
  },
});

/**
 * Get a signed URL for uploading a file to AWS S3.
 * @async
 * @function
 * @param {Object} file - The file object to be uploaded.
 * @param {string} file.name - The name of the file.
 * @returns {Promise<{ success: { url: string } }|{ failure: { error: Error } }>} - An object with a success field containing the signed URL or a failure field with an error object.
 */
export const getSignedURL = async (file) => {
  try {
    const { sessionClaims } = auth();
    const userId = sessionClaims?.userId;

    // Validate user authentication
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Validate file object
    if (!file || !file.name || !file.size || !file.type) {
      throw new Error("Invalid file object");
    }

    const currentTimestamp = Date.now(); // Get current timestamp in milliseconds

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${userId}/${currentTimestamp}_${file.name}`,
    });

    const url = await getSignedUrl(
      s3Client,
      putObjectCommand,
      { expiresIn: 60 } // 60 seconds
    );

    return { success: { url } };
  } catch (error) {
    handleError(error);
    return { failure: { error } };
  }
};
