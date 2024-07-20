import { Router } from 'express';
import { AuthorizedRole, isAuthenticated } from '../middleware/auth';
import { uploadCourse, EditCourse, getSingleCourse, getAllCourse, getCourseByuser, addQuestion, AddAnswer, AddReview, AddReplyToReview } from '../controllers/Course.Controller';

const courseRoute = Router();

// Route to handle user registration
courseRoute.post('/create-course', isAuthenticated, AuthorizedRole(['admin', 'user']), uploadCourse);
courseRoute.put('/edit-course/:id', isAuthenticated, AuthorizedRole(['admin', 'user']), EditCourse);
courseRoute.get('/get-course/:id', getSingleCourse);
courseRoute.get('/get-all-course', getAllCourse);
courseRoute.get('/get-course-content/:id', isAuthenticated, getCourseByuser);
courseRoute.put('/add-question', isAuthenticated, addQuestion);
courseRoute.put('/add-answer', isAuthenticated, AddAnswer);
courseRoute.put('/add-review/:id', isAuthenticated, AddReview);
courseRoute.put('/add-reply', isAuthenticated, AuthorizedRole(['admin']), AddReplyToReview);

export { courseRoute };
