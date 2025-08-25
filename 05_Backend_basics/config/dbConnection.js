import mongoose from "mongoose"

const ConnectDB = async () => {
    try {
        await mongoose.connect(`${process.env.DB_CONNECTION_STRING}/${process.env.DB_NAME}`);
        console.log("DB Connection Established !");
    } catch (error) {
        console.error('Error While connecting to DB ', error);

    }

}

export default ConnectDB