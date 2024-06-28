import { ID, Query } from 'appwrite';
import { INewUser, IResetPassword, IUpdateUser, IVerification } from '@/types';
import { account, appwriteConfig, avatars, databases, storage } from './config';

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(ID.unique(), user.email, user.password, user.name);
        if (!newAccount) throw Error;

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatars.getInitials(user.name)
        });

        console.log(newAccount);
        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function saveUserToDB(user: {
    accountId: string;
    username: string;
    name: string;
    email: string;
    imageUrl: URL;
}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );

        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
    try {
        const session = await account.createEmailPasswordSession(user.email, user.password);

        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function requestPasswordRecovery(user: { email: string }) {
    try {
        const response = await account.createRecovery(
            user.email,
            import.meta.env.VITE_RESET_PASS_REDIRECT_URL
        );
        return {
            status: 200,
            message: response.userId
        };
    } catch (error) {
        console.log(error);
        return {
            status: error.code,
            message: error.response.message
        };
    }
}

export async function resetPassword(data: IResetPassword) {
    try {
        const response = await account.updateRecovery(data.userId, data.secret, data.password);
        console.log(response);

        return {
            status: 200,
            message: response.userId
        };
    } catch (error) {
        console.log(error);
        return {
            status: error.code,
            message: error.response.message
        };
    }
}

export async function createVerification() {
    try {
        const response = await account.createVerification(
            import.meta.env.VITE_VERIFICATION_REDIRECT_URL
        );
        return {
            status: 200,
            message: response.userId
        };
    } catch (error) {
        console.log(error);
        return {
            status: error.code,
            message: error.response.message
        };
    }
}

export async function updateVerification(data: IVerification) {
    try {
        const response = await account.updateVerification(data.userId, data.secret);
        console.log(response);
        localStorage.removeItem('userCookie');

        return {
            status: 200,
            message: response.userId
        };
    } catch (error) {
        console.log(error);
        return {
            status: error.code,
            message: error.response.message
        };
    }
}

// ============================== GET ACCOUNT
export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error) {
        console.log(error);
    }
}

// ============================== GET USER
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();

        if (!currentAccount) throw Error;

        console.log('in apis: ');
        console.log(currentAccount);
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser) throw Error;

        const currentUserData = currentUser.documents[0];
        currentUserData['verified'] = currentAccount.emailVerification;
        currentUserData['label'] = currentAccount.labels?.[0];

        return currentUserData;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// ============================== SIGN OUT
export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');
        localStorage.removeItem('userCookie');
        return session;
    } catch (error) {
        console.log(error);
    }
}

// ============================================================
// USER
// ============================================================

// ============================== GET USERS
export async function getUsers(limit?: number) {
    const queries = [Query.orderDesc('$createdAt')];

    if (limit) {
        queries.push(Query.limit(limit));
    }

    try {
        const users = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            queries
        );

        if (!users) throw Error;

        return users;
    } catch (error) {
        console.log(error);
    }
}

// ============================== GET USER BY ID
export async function getUserById(userId: string) {
    try {
        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            userId
        );

        if (!user) throw Error;

        return user;
    } catch (error) {
        console.log(error);
    }
}

// ============================== UPDATE USER
export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
        let image = {
            imageUrl: user.imageUrl,
            imageId: user.imageId
        };

        if (hasFileToUpdate) {
            // Upload new file to appwrite storage
            const uploadedFile = await uploadFile(user.file[0]);
            if (!uploadedFile) throw Error;

            // Get new file url
            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id);
                throw Error;
            }

            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
        }

        //  Update user
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                bio: user.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId
            }
        );

        // Failed to update
        if (!updatedUser) {
            // Delete new file that has been recently uploaded
            if (hasFileToUpdate) {
                await deleteFile(image.imageId);
            }
            // If no new file uploaded, just throw error
            throw Error;
        }

        // Safely delete old file after successful update
        if (user.imageId && hasFileToUpdate) {
            await deleteFile(user.imageId);
        }

        return updatedUser;
    } catch (error) {
        console.log(error);
    }
}

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
    try {
        const uploadedFile = await storage.createFile(appwriteConfig.storageId, ID.unique(), file);

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

// ============================== GET FILE URL
export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            undefined,
            100
        );

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId);

        return { status: 'ok' };
    } catch (error) {
        console.log(error);
    }
}
