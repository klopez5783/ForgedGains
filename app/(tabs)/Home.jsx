import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
    const fetchAndDisplayData = async () => {
            console.log("user:", user);
            
            // 1. Check if guest user has calculated data in the global state
            const hasGuestData = user && user.bmr > 0; // Check for BMR > 0 as a flag

            if (user && user.uid) {
                // --- AUTHENTICATED USER FLOW (Fetch from Firestore) ---
                try {
                    const data = await getUserData(user);
                    
                    // If data is null/empty from Firestore, use the global user object as a fallback
                    const sourceData = data || user; 

                    if (sourceData) {
                        // All your original data parsing logic (dates, parsing floats)
                        const bodyFatDate = sourceData.bodyFatUpdatedAt?.toDate();
                        const bodyFatFormattedDate = bodyFatDate ? `${(bodyFatDate.getMonth() + 1).toString().padStart(2, '0')}/${bodyFatDate.getDate().toString().padStart(2, '0')}/${bodyFatDate.getFullYear()}` : "";
                        
                        const weightDate = sourceData.weightUpdatedAt?.toDate();
                        const WeightFormattedDate = weightDate ? `${(weightDate.getMonth() + 1).toString().padStart(2, '0')}/${weightDate.getDate().toString().padStart(2, '0')}/${weightDate.getFullYear()}` : "";

                        const parsedData = {
                            // Use sourceData properties, defaulting where necessary
                            firstName: sourceData.firstName || user.displayName || "User",
                            age: sourceData.age || "",
                            gender: sourceData.gender || "",
                            weight: sourceData.weight || "",
                            height: sourceData.height || "",
                            bodyFat: sourceData.BodyFat || sourceData.bodyFat || "", // Check both casing
                            bodyFatTimeStamp: bodyFatFormattedDate,
                            weightTimeStamp: WeightFormattedDate,
                            activityLevel: sourceData.activityLevel || "",
                            // Use parsed values with a fallback to 0
                            bmr: parseFloat(sourceData.bmr) || 0,
                            protein: parseFloat(sourceData.protein) || 0,
                            carbs: parseFloat(sourceData.carbs) || 0,
                            fats: parseFloat(sourceData.fats) || 0,
                            tdee: parseFloat(sourceData.tdee) || 0,
                        };

                        setUserFitnessData(parsedData);
                        console.log("User Fitness Data (Authenticated):", parsedData);
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
            
            } else if (hasGuestData) {
                // --- GUEST USER FLOW (Data is already in Global State) ---
                console.log("No UID, but found guest results in global state. Displaying...");
                
                // NOTE: The calculated data in the global 'user' object is already numeric/ready
                const guestData = {
                    firstName: user.displayName, // "Guest"
                    age: user.age,
                    gender: user.gender,
                    weight: user.weight,
                    height: user.height,
                    bodyFat: user.BodyFat || user.bodyFat, 
                    bodyFatTimeStamp: "", // Guest data won't have Firestore timestamps
                    weightTimeStamp: "",
                    activityLevel: user.ActivityLevel,
                    bmr: user.bmr,
                    protein: user.protein,
                    carbs: user.carbs,
                    fats: user.fats,
                    tdee: user.tdee,
                };

                setUserFitnessData(guestData);
                console.log("User Fitness Data (Guest):", guestData);
                setBmr(guestData.bmr);
                setTdee(guestData.tdee);
                setMacros({
                    "Fats": guestData.fats,
                    "Carbs": guestData.carbs,
                    "Protein": guestData.protein
                });
                setLoading(false);
                
            } else {
                // --- NO DATA FOUND (Initial load for a new guest) ---
                console.log("No authenticated user or guest data found. Skipping data fetch.");
                setLoading(false);
            }
        };
        
        fetchAndDisplayData();
    }, [user]); // Depend on user to re-run when the global user object changes

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

    const handleShowSourcesModal = () => {
    const modalContent = (
        <View style={{ padding: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginBottom: 15 }}>
                Sources & References
            </Text>

            <Text style={{ fontSize: 16, marginBottom: 15 }}>
                • Body Fat Formula: U.S. Navy Method{"\n"}
                https://www.omnicalculator.com/health/navy-body-fat
            </Text>

            <Text style={{ fontSize: 16, marginBottom: 15 }}>
                • Calorie Deficit Guidelines: NIH Dietary Guidelines{"\n"}
                https://www.nhlbi.nih.gov/health/educational/lose_wt/index.htm
            </Text>

            <Text style={{ fontSize: 16, marginBottom: 15 }}>
                • Macro Distribution Recommendations: USDA Dietary Guidelines{"\n"}
                https://www.dietaryguidelines.gov
            </Text>

            <Text style={{ fontSize: 14, color: "gray", marginTop: 20 }}>
                Disclaimer: This app provides general fitness and nutrition information 
                and is not a substitute for medical advice. Consult a healthcare professional before making changes to your diet or exercise routine.
            </Text>

            <View style={{ alignItems: 'center', marginTop: 25 }}>
                <Button title="Close" onPress={hideModal} />
            </View>
        </View>
    );

    showModal(modalContent);
};


    return (
        <SafeAreaView className="bg-backGround h-full">
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <View className={`justify-center w-full mx-auto px-4`}>
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
                                <Text className={`text-lg font-pbold text-white font-bold mt-2 ml-4`}>
                                    Hello {userFitnessData?.firstName || "User"},
                                </Text>
                                <View className="mt-3 flex-row justify-evenly items-center">
                                    <View>
                                        <Text className={`text-lg text-white font-psemibold`}>
                                            Body Fat: {userFitnessData?.bodyFat || ""}%
                                        </Text>
                                        <Text className={`text-lg text-white font-psemibold`}>
                                            Weight: {userFitnessData?.weight || ""}
                                        </Text>
                                        <Text className={`text-lg text-white font-psemibold`}>
                                            Age: {userFitnessData?.age || ""}
                                        </Text>
                                        <Text className={`text-lg text-white font-psemibold`}>
                                            Height: {userFitnessData?.height || ""}
                                        </Text>
                                    </View>
                                    <View className="flex-col content-start">
                                        <Text className={`text-lg text-white`}>
                                            Updated: {userFitnessData?.bodyFatTimeStamp}
                                        </Text>
                                        <Text className={`text-lg text-white`}>
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
                                    <View className={"w-1/4 mx-auto flex-col gap-1"} >
                                        {Macros && (
                                            <View className="flex-col">
                                                {/* Protein */}
                                                <View className="flex-row justify-between">
                                                    <Text className={`"text-lg"} text-green-500 font-psemibold`}>Protein: </Text>
                                                    <Text className={`"text-lg"} text-right text-green-500 font-psemibold`}>
                                                        {/* 1. Check if the value is a valid number (!isNaN)
                                                        2. If true, display the value (rounded to avoid rendering too many decimals).
                                                        3. If false (it's NaN), display '0'. 
                                                        */}
                                                        {!isNaN(Macros.Protein) ? Math.round(Macros.Protein) : '0'}g
                                                    </Text>
                                                </View>
                                                
                                                {/* Fats */}
                                                <View className="flex-row justify-between">
                                                    <Text className={`"text-lg"} text-red-500 font-psemibold`}>Fats:</Text>
                                                    <Text className={`"text-lg"} text-red-500 font-psemibold`}>
                                                        {!isNaN(Macros.Fats) ? Math.round(Macros.Fats) : '0'}g
                                                    </Text>
                                                </View>
                                                
                                                {/* Carbs */}
                                                <View className="flex-row justify-between">
                                                    <Text className={`"text-lg"} text-blue-500 font-psemibold`}>Carbs: </Text>
                                                    <Text className={`"text-lg"} text-right text-blue-500 font-psemibold`}>
                                                        {!isNaN(Macros.Carbs) ? Math.round(Macros.Carbs) : '0'}g
                                                    </Text>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                    <View className="mx-auto">
                                        {/* // 1. Check if Macros object exists
                                        // 2. Check if tdee is a valid, finite number (not NaN, not Infinity)
                                        // 3. Check if one of the core macro values (like Protein) is a valid number */}
                                        {Macros && isFinite(tdee) && !isNaN(Macros.Protein) && (
                                            <PieChart
                                                // The Data prop should ideally be checked inside the PieChart component itself,
                                                // but this ensures the component receives an object that won't immediately crash.
                                                Data={Macros}
                                                
                                                // Pass the safe, rounded calories value
                                                Calories={Math.round(tdee - 500)}
                                            />
                                        )}
                                    </View>
                                </View>

                                <TouchableOpacity onPress={handleShowSourcesModal}>
                                    <Text style={{ color: '#007AFF', marginTop: 20, textAlign: 'center' }}>
                                        View Sources & References
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            <View className="rounded-lg p-4 mt-5 bg-backGround-300">
                                <View className="rounded-lg p-2 bg-backGround-300">
                                    <Text className={`text-white font-bold "text-2xl" : "text-lg"}`}>
                                        Your BMR: {bmr ? `${bmr} kcal/day` : "Calculating..."}
                                    </Text>
                                </View>
                                <View className="rounded-lg p-2 mt-2 bg-backGround-300">
                                    <Text className={`text-white font-bold "text-2xl" : "text-lg"}`}>
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

                        <Text style={{ fontSize: 14, marginTop: 20, color: "gray" }}>
                            Disclaimer: This app provides general fitness and nutrition information
                            and is not intended as a substitute for professional medical advice.
                            Always consult a healthcare provider before starting a new fitness program.
                        </Text>
                    
                </View>
            </ScrollView>
        </SafeAreaView>

        
    );
}