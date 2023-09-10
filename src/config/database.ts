import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI
export const dbConnection = async() => {
    try {
        if(uri) {
            await mongoose.connect(uri); 
            return console.log('DB is connected');
        }

        console.log('Invalid uri')
        
    } catch (error) {
       console.log(error) 
    }
}