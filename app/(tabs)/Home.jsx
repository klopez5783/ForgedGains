import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomBTN from '../../components/CustomBTN';
import PieChart from '../../components/MacroPieChart';
import { useModal } from '../../components/Modal';
import { useGlobalContext } from "../../context/globalProvider";
import { SignUserOut, deleteCurrentUser } from '../../Database/authentication';
import { getUserData } from '../../Database/FitnessData';
export default function Home() {
    const router = useRouter();
    const { user } = useGlobalContext();

    const [tdee, setTdee] = useState(null);
    const [bmr, setBmr] = useState(null);
    const [Macros, setMacros] = useState(null);
    const [userFitnessData, setUserFitnessData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { showModal, hideModal } = useModal(); // 👈 Use the hook


    // ✅ Single useEffect to fetch all data and set all states
    useEffect(() => {
        const fetchUserData = async () => {
            console.log("user:", user);
            if (user) {
                try {
                    const data = await getUserData(user);
                    if (data) {
                        const bodyFatDate = data.bodyFatUpdatedAt?.toDate();
                        const bodyFatFormattedDate = bodyFatDate ? `${(bodyFatDate.getMonth() + 1).toString().padStart(2, '0')}/${bodyFatDate.getDate().toString().padStart(2, '0')}/${bodyFatDate.getFullYear()}` : "";
                        
                        const weightDate = data.weightUpdatedAt?.toDate();
                        const WeightFormattedDate = weightDate ? `${(weightDate.getMonth() + 1).toString().padStart(2, '0')}/${weightDate.getDate().toString().padStart(2, '0')}/${weightDate.getFullYear()}` : "";

                        const parsedData = {
                            firstName: data.firstName || "Guest",
                            age: data.age || "",
                            gender: data.gender || "",
                            weight: data.weight || "",
                            height: data.height || "",
                            bodyFat: data.BodyFat || "",
                            bodyFatTimeStamp: bodyFatFormattedDate,
                            weightTimeStamp: WeightFormattedDate,
                            activityLevel: data.activityLevel || "",
                            // Use parsed values with a fallback to 0
                            bmr: parseFloat(data.bmr) || 0,
                            protein: parseFloat(data.protein) || 0,
                            carbs: parseFloat(data.carbs) || 0,
                            fats: parseFloat(data.fats) || 0,
                            tdee: parseFloat(data.tdee) || 0,
                        };

                        setUserFitnessData(parsedData);
                        console.log("User Fitness Data:", parsedData);
                        setBmr(parsedData.bmr);
                        setTdee(parsedData.tdee);
                        setMacros({
                            "Fats": parsedData.fats,
                            "Carbs": parsedData.carbs,
                            "Protein": parsedData.protein
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUserData();
    }, [user]);

    const handleSignOut = async () => {
        try {
            console.log("Signing Out...");
            await SignUserOut();
            router.replace('/');
        } catch (err) {
            alert(err.message);
        }
    };


    const handleDeleteAccount = async () => {

        try {
            await deleteCurrentUser();
            router.replace('/');
        } catch (err) {
            alert(err.message);
        }

    }

    const handleSignIn = () => {
        // Navigate to app/(auth)/sign-in.jsx
        router.push('/sign-in');
    }

    const handleSignUp = () => {
        router.push('/sign-up');
    }

    const handleShowDeleteModal = () => {
        const modalContent = (
            <View style={{ alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>
                    Are you sure you want to delete your account?
                </Text>
                <Text style={{ textAlign: 'center', fontSize: 16, marginBottom: 20 }}>
                    This action cannot be undone.
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                    <Button
                        title="Yes, Delete"
                        color="#FF0000"
                        onPress={() => {
                            hideModal();
                            handleDeleteAccount();
                        }}
                    />
                    <Button
                        title="Cancel"
                        onPress={hideModal}
                    />
                </View>
            </View>
        );
        showModal(modalContent);
    };

    return (
        <SafeAreaView className="bg-backGround h-full">
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <View className={`justify-center ${Platform.isPad ? 'w-3/4' : 'w-full'} mx-auto px-4`}>
                    <Text className="text-3xl text-darkGold font-bold mt-10">
                        Home
                    </Text>

                    {loading ? (
                        <View className="flex-1 justify-center items-center mt-5">
                            <ActivityIndicator size="large" color="#FFC300" />
                        </View>
                    ) : (
                        <View>
                            <View className="rounded-lg p-4 mt-3 bg-backGround-300">
                                <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} font-pbold text-white font-bold mt-2 ml-4`}>
                                    Hello {userFitnessData?.firstName || "User"},
                                </Text>
                                <View className="mt-3 flex-row justify-evenly items-center">
                                    <View>
                                        <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-white font-psemibold`}>
                                            Body Fat: {userFitnessData?.bodyFat || ""}%
                                        </Text>
                                        <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-white font-psemibold`}>
                                            Weight: {userFitnessData?.weight || ""}
                                        </Text>
                                        <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-white font-psemibold`}>
                                            Age: {userFitnessData?.age || ""}
                                        </Text>
                                        <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-white font-psemibold`}>
                                            Height: {userFitnessData?.height || ""}
                                        </Text>
                                    </View>
                                    <View className="flex-col content-start">
                                        <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-white`}>
                                            Updated: {userFitnessData?.bodyFatTimeStamp}
                                        </Text>
                                        <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-white`}>
                                            Updated: {userFitnessData?.weightTimeStamp}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <Text className="text-2xl text-white font-bold text-center mt-5">
                                Daily Macro Goals
                            </Text>

                            <View className="rounded-lg p-4 mt-2 bg-backGround-300">
                                <View className="flex-row justify-evenly">
                                    <View className={`${Platform.isPad ? "" : "w-1/4"} mx-auto flex-col gap-1`}>
                                        {Macros && (
                                            <View className="flex-col">
                                                <View className="flex-row justify-between">
                                                    <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-green-500 font-psemibold`}>Protein: </Text>
                                                    <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-right text-green-500 font-psemibold`}>{Macros.Protein}g</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-red-500 font-psemibold`}>Fats:</Text>
                                                    <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-red-500 font-psemibold`}>{Macros.Fats}g</Text>
                                                </View>
                                                <View className="flex-row justify-between">
                                                    <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-blue-500 font-psemibold`}>Carbs: </Text>
                                                    <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-right text-blue-500 font-psemibold`}>{Macros.Carbs}g</Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                    <View className="mx-auto">
                                        {Macros && (
                                            <PieChart
                                                Data={Macros}
                                                Calories={tdee - 500}
                                            />
                                        )}
                                    </View>
                                </View>
                            </View>

                            <View className="rounded-lg p-4 mt-5 bg-backGround-300">
                                <View className="rounded-lg p-2 bg-backGround-300">
                                    <Text className={`text-white font-bold ${Platform.isPad ? "text-2xl" : "text-lg"}`}>
                                        Your BMR: {bmr ? `${bmr} kcal/day` : "Calculating..."}
                                    </Text>
                                </View>
                                <View className="rounded-lg p-2 mt-2 bg-backGround-300">
                                    <Text className={`text-white font-bold ${Platform.isPad ? "text-2xl" : "text-lg"}`}>
                                        Your TDEE: {tdee ? `${tdee} kcal/day` : "Calculating..."}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    
                      {user.isAnonymous ? (
                        <View className="flex flex-row items-center">

                            <CustomBTN
                            Title="Sign In"
                            handlePress={handleSignIn}
                            width={175}
                            otherStyles={"mt-5"}
                            />
                            
                            <CustomBTN
                            Title="Sign Up"
                            handlePress={handleSignUp}
                            width={175}
                            otherStyles={"mt-5"}
                            />

                        </View>

                        ):(

                        <View className="flex flex-row items-center">

                            <CustomBTN
                            Title="Sign Out"
                            handlePress={handleSignOut}
                            width={175}
                            otherStyles={"mt-5"}
                            />
                            
                            <CustomBTN
                            Title="Delete Account"
                            handlePress={handleShowDeleteModal}
                            width={175}
                            otherStyles={"mt-5 bg-red-600"}
                            />

                        </View>
                        )}

                    
                </View>
            </ScrollView>
        </SafeAreaView>

        
    );
}