import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { blogServices } from './blog.services';
const createBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.createBlog(req.body, req.file, req.user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Contact Blog successfully',
    data: result,
  });
});
const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await blogServices.updateBlog(
    req.body,
    req.file,
    req.user,
    id,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Blog update successfully',
    data: result,
  });
});

const allBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await blogServices.allBlogIntoDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'All Blog retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const getMyBlog = catchAsync(async (req: Request, res: Response) => {
  console.log(req.user);
  const user = req.user;
  const result = await blogServices.myBlogIntoDB(user, req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'My Blog retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});
const singleBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await blogServices.singleBlogIntoDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Blog retrieved successfully',
    data: result,
  });
});
const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await blogServices.deleteBlogIntoDB(id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Blog delete successfully',
    data: result,
  });
});

export const blogController = {
  createBlog,
  getMyBlog,
  allBlog,
  singleBlog,
  deleteBlog,
  updateBlog,
};
