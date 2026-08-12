import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { User } from "../models/user.js";
import { Post } from "../models/post.js";

dotenv.config({
    path: ".env",
});

const posts = [
    {
        caption: "Started building something exciting with MERN today 🚀",
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
    {
        caption: "Clean UI, clean code, better products.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },
    {
        caption: "Learning something new every single day 💻",
        image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    },
    {
        caption: "Finally completed my first full-stack feature!",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c",
    },
    {
        caption: "Consistency beats motivation. Keep building. 🔥",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    },
    {
        caption: "Working on my developer portfolio today.",
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    },
    {
        caption: "React + Node.js + MongoDB = ❤️",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
    },
    {
        caption: "Debugging is just another way of learning 😅",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    },
    {
        caption: "Small progress every day leads to big results.",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    },
    {
        caption: "Working on a new project architecture today.",
        image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    },
    {
        caption: "Backend development is getting more interesting every day.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    },
    {
        caption: "Building products that solve real problems.",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
    },
    {
        caption: "Today's goal: write better and cleaner code.",
        image: "https://images.unsplash.com/photo-1516321165247-4aa89a48be28",
    },
    {
        caption: "Just finished working on an API integration.",
        image: "https://images.unsplash.com/photo-1556761175-b413da4baf72",
    },
    {
        caption: "Developer life: code, coffee, debug, repeat ☕",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    },
    {
        caption: "Exploring new technologies and improving my skills.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
    },
    {
        caption: "One more feature shipped successfully 🚀",
        image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902",
    },
    {
        caption: "Good architecture makes development much easier.",
        image: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0",
    },
    {
        caption: "Building my developer network one connection at a time.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c",
    },
    {
        caption: "Keep learning. Keep building. Keep growing. 💙",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    },
];

const seedPosts = async () => {
    try {
        await connectDB();

        const users = await User.find().select("_id");

        if (users.length === 0) {
            console.log("❌ No users found. Create users first.");
            process.exit(1);
        }

        await Post.deleteMany({});

        const seededPosts = posts.map((post, index) => ({
            userId: users[index % users.length]._id,
            caption: post.caption,
            image: post.image,
            imagePublicId: "",
        }));

        await Post.insertMany(seededPosts);

        console.log(`✅ ${seededPosts.length} posts seeded successfully`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to seed posts:", error);
        process.exit(1);
    }
};

seedPosts();