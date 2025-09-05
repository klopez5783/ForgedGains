import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomBTN from '../../components/CustomBTN';
import PieChart from '../../components/MacroPieChart';
import { useGlobalContext } from "../../context/globalProvider";
import { SignUserOut } from '../../Database/authentication';
import { getUserData } from '../../Database/FitnessData';

export default function Home() {
    const router = useRouter();
    const { user } = useGlobalContext();

    const [tdee, setTdee] = useState(null);
    const [bmr, setBmr] = useState(null);
    const [Macros, setMacros] = useState(null);
    const [userFitnessData, setUserFitnessData] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Single useEffect to fetch all data and set all states
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const data = await getUserData(user);
                    if (data) {
                        const bodyFatDate = data.bodyFatUpdatedAt?.toDate();
                        const bodyFatFormattedDate = bodyFatDate ? `${(bodyFatDate.getMonth() + 1).toString().padStart(2, '0')}/${bodyFatDate.getDate().toString().padStart(2, '0')}/${bodyFatDate.getFullYear()}` : "";
                        
                        const weightDate = data.weightUpdatedAt?.toDate();
                        const WeightFormattedDate = weightDate ? `${(weightDate.getMonth() + 1).toString().padStart(2, '0')}/${weightDate.getDate().toString().padStart(2, '0')}/${weightDate.getFullYear()}` : "";

                        const parsedData = {
                            firstName: data.firstName || "User",
                            age: data.age || "",
                            gender: data.gender || "",
                            weight: data.weight || "",
                            height: data.height || "",
                            bodyFat: data.bodyFat || "",
                            bodyFatTimeStamp: bodyFatFormattedDate,
                            weightTimeStamp: WeightFormattedDate,
                            activityLevel: data.activityLevel || "",
                            // Use parsed values with a fallback to 0
                            bmr: parseFloat(data.bmr) || 0,
                            calories: parseFloat(data.calories) || 0,
                            protein: parseFloat(data.protein) || 0,
                            carbs: parseFloat(data.carbs) || 0,
                            fats: parseFloat(data.fats) || 0,
                        };

                        setUserFitnessData(parsedData);
                        setBmr(parsedData.bmr);
                        setTdee(parsedData.tedee);
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

                    <CustomBTN
                        Title="Sign Out"
                        handlePress={handleSignOut}
                        width={200}
                        otherStyles={"mt-5"}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}