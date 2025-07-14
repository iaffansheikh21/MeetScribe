import User, { type IUser } from "@/models/User"
import connectDB from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export class UserController {
  static async getAllUsers(): Promise<IUser[]> {
    await connectDB()
    try {
      const users = await User.find({}).select("-password")
      console.log("✅ Fetched all users:", users.length)
      return users
    } catch (error) {
      console.error("❌ Error fetching users:", error)
      throw new Error("Failed to fetch users")
    }
  }

  static async getUserById(id: string): Promise<IUser | null> {
    await connectDB()
    try {
      const user = await User.findById(id).select("-password")
      console.log("✅ Fetched user by ID:", id, user ? "Found" : "Not found")
      return user
    } catch (error) {
      console.error("❌ Error fetching user by ID:", error)
      throw new Error("Failed to fetch user")
    }
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    await connectDB()
    try {
      const user = await User.findOne({ email })
      console.log("✅ Fetched user by email:", email, user ? "Found" : "Not found")
      return user
    } catch (error) {
      console.error("❌ Error fetching user by email:", error)
      throw new Error("Failed to fetch user")
    }
  }

  static async authenticateUser(email: string, password: string): Promise<IUser | null> {
    await connectDB()
    try {
      const user = await User.findOne({ email })
      if (!user) {
        console.log("❌ User not found for email:", email)
        return null
      }

      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) {
        console.log("❌ Invalid password for email:", email)
        return null
      }

      console.log("✅ User authenticated successfully:", email)
      // Return user without password
      const { password: _, ...userWithoutPassword } = user.toObject()
      return userWithoutPassword as IUser
    } catch (error) {
      console.error("❌ Error authenticating user:", error)
      throw new Error("Failed to authenticate user")
    }
  }

  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    await connectDB()
    try {
      // Hash password before saving
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 12)
      }

      const user = new User(userData)
      const savedUser = await user.save()
      console.log("✅ User created successfully:", savedUser.email)

      // Return user without password
      const { password: _, ...userWithoutPassword } = savedUser.toObject()
      return userWithoutPassword as IUser
    } catch (error) {
      console.error("❌ Error creating user:", error)
      throw new Error("Failed to create user")
    }
  }

  static async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    await connectDB()
    try {
      // Hash password if it's being updated
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 12)
      }

      const user = await User.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true }).select(
        "-password",
      )

      console.log("✅ User updated successfully:", id)
      return user
    } catch (error) {
      console.error("❌ Error updating user:", error)
      throw new Error("Failed to update user")
    }
  }

  static async deleteUser(id: string): Promise<boolean> {
    await connectDB()
    try {
      const result = await User.findByIdAndDelete(id)
      console.log("✅ User deleted successfully:", id)
      return !!result
    } catch (error) {
      console.error("❌ Error deleting user:", error)
      throw new Error("Failed to delete user")
    }
  }
}
