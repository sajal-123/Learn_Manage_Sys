import { Router } from 'express';
import { AuthorizedRole, isAuthenticated } from '../middleware/auth';
import { createLayout, EditLayout, getLayout } from '../controllers/Layout.Controller';

const LayoutRouter = Router();

LayoutRouter.post('/create-layout', isAuthenticated, AuthorizedRole(['admin']), createLayout)
LayoutRouter.put('/edit-layout', isAuthenticated, AuthorizedRole(['admin']), EditLayout)
LayoutRouter.get('/get-layout', getLayout)



export { LayoutRouter }