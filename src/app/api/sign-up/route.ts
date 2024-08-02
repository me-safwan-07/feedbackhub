import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();
        
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingVerifiedUserByUsername) {
            return Response.json(
                {
                    success: false,
                    messages: "Username is already taken",
                },
                {
                    status: 400
                }
            );
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        let verifycode = Math.floor(100000 + Math.random() * 900000).toString();
        
        if (existingUserByEmail) {
           if(existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        messages: "User already exists with this email",
                    },
                    { status: 400 }
                );
           } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifycode = verifycode;
                existingUserByEmail.veifyCodeExpriry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
           }
        } else {
            const hasedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                username,
                email,
                passwordhash: hasedPassword,
                verifycode,
                veifyCodeExpriry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],
            });

            await newUser.save();
        }

        // send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifycode
        );
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status : 500 }
            )
        }

        return Response.json(
            {
                success: true,
                messages: "User registered successfully. Please verify your account.",
            },
            { status: 201 }
        );
    } catch(error) {
        console.error("Error registering user", error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500,
            }
        );
    }
}