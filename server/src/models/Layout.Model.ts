import { Document, model, Schema } from "mongoose";

interface FaqItem extends Document {
    question: string,
    answer: string
}

interface Category extends Document {
    title: string
}

interface BannerImage extends Document {
    public_id: string
    url: string;
}
interface Layout extends Document {
    type: string;
    faq: FaqItem[];
    categories: Category[];
    banner: {
        Image: BannerImage;
        title: string;
        subTitle: string
    }
}


const faqSchema = new Schema<FaqItem>({
    question: {
        type: String,
    },
    answer: {
        type: String,
    }
})
const categorySchema = new Schema<Category>({
    title: {
        type: String,
    }
})
const BannerImageSchema = new Schema<BannerImage>({
    public_id: {
        type: String,
    },
    url: {
        type: String,
    }
})
const layoutSchema = new Schema<Layout>({
    type: {
        type: String,
    },
    faq: [faqSchema],
    categories: [categorySchema],
    banner: {
        Image: BannerImageSchema,
        title: String,
        subTitle: String
    }
})


const LayoutModel = model<Layout>("Layout", layoutSchema);

export {LayoutModel};
