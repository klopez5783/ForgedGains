import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Platform, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomBTN from '../../components/CustomBTN'
import PieChart from '../../components/MacroPieChart'
import { useGlobalContext } from "../../context/globalProvider"
import { SignUserOut } from '../../Database/authentication'
import { getUserData } from '../../Database/FitnessData'



export default function Home() {

  const router = useRouter();

  const {user} = useGlobalContext();

  const [tdee,setTdee] = useState(null);
  const [bmr, setBmr] = useState(null);

  const [Macros, setMacros] = useState({});

 
const [userFitnessData, setUserFitnessData] = useState(null);

const [loading, setLoading] = useState(true); // Track loading state

useEffect(() => {
  const fetchUserData = async () => {
    if (user) {
      try {
        const data = await getUserData(user);
        if (data) {

          const bodyFatDate = data.bodyFatUpdatedAt.toDate();

          const bodyFatFormattedDate = `${(bodyFatDate.getMonth() + 1).toString().padStart(2, '0')}/${bodyFatDate.getDate().toString().padStart(2, '0')}/${bodyFatDate.getFullYear()}`;
          
          const weightDate = data.weightUpdatedAt.toDate();

          const WeightFormattedDate = `${(weightDate.getMonth() + 1).toString().padStart(2, '0')}/${weightDate.getDate().toString().padStart(2, '0')}/${weightDate.getFullYear()}`;


          setUserFitnessData({
            firstName: data.firstName || "User",
            age: data.age || "",
            gender: data.gender || "",
            weight: data.weight || "",
            height: data.height || "",
            bodyFat: data.bodyFat || "",
            bodyFatTimeStamp: bodyFatFormattedDate || "",
            weightTimeStamp: WeightFormattedDate || "",
            activityLevel: data.activityLevel || "",
            protein: data.protein || "",
            carbs: data.carbs || "",
            fats: data.fats || ""
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false); // Ensure loading stops even if there's an error
      }
    }
  };
  fetchUserData();
}, [user]);



useEffect(() => {
  if (userFitnessData) {
    const weightKg = userFitnessData.weight * 0.453592; // Convert lbs to kg
    const heightCm = (5 * 30.48) + (9 * 2.54); // Convert 5'9" to cm

    let calculatedBMR;
    if (userFitnessData.gender === "Male") {
      calculatedBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * userFitnessData.age) + 5;
    } else {
      calculatedBMR = (10 * weightKg) + (6.25 * heightCm) - (5 * userFitnessData.age) - 161;
    }

    setBmr(Math.round(calculatedBMR));

    // Assume Moderate Exercise (adjust as needed)
    const calculatedTDEE = calculatedBMR * 1.55;
    setTdee(Math.round(calculatedTDEE));

    const protein = Math.round(((calculatedTDEE - 500) * 0.3) / 4); // 30% of TDEE from protein
    const fats = Math.round(((calculatedTDEE - 500) * 0.2) / 9); // 25% of TDEE from fats
    const carbs = Math.round(((calculatedTDEE - 500) * 0.45) / 4); // 45% of TDEE from carbs

    console.log("userFitnessData", userFitnessData);

    setMacros({ // ✅ Use state setter to trigger re-render
      "Fats": userFitnessData.fats,
      "Carbs": userFitnessData.carbs,
      "Protein": userFitnessData.protein
    });

  }
}, [userFitnessData]);




useEffect(() => {
  console.log("User Fitness Data Set");
}, [userFitnessData]); // Logs when `userFitnessData` changes

  const handleSignOut = async() => {
  try {
    console.log("Signing Out...");
    await SignUserOut();
    router.replace('/')
  }catch(err){
    alert(err.message)
  }
}

  return (
    <SafeAreaView className="bg-backGround h-full">
      <ScrollView
      contentContainerStyle={{ paddingBottom: 120 }}>
      <View className={`justify-center ${Platform.isPad ? 'w-3/4' : 'w-full'} mx-auto px-4`}>
        <Text className="text-3xl text-darkGold font-bold mt-10">
          Home
        </Text>


          <View className="">



          <View className="rounded-lg p-4 mt-3 bg-backGround-300">  
            
                {loading ? (
                  <View className="flex-1 justify-center items-center mt-5">
                  <ActivityIndicator size="large" color="#FFC300" />
                </View>
                ) : (
                  <View>
                    <Text className={`${Platform.isPad ? "text-2xl" : "text-lg" } font-pbold text-white font-bold mt-2 ml-4`}>
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

                      <View className="h-full grid grid-cols-3 content-start">
                        <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-white`}>
                          Updated: {userFitnessData?.bodyFatTimeStamp}
                        </Text>
                        <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-white`}>
                          Updated: {userFitnessData?.weightTimeStamp}
                        </Text>
                      </View>

                    </View>
                  </View>
                )}


              
              <View>

              </View>
            </View>

            <Text className="text-2xl text-white font-bold text-center mt-5">
              Daily Macro Goals
            </Text>

            <View className="rounded-lg p-4 mt-2 bg-backGround-300">
              <View className="flex-row justify-evenly">
                <View className={`${Platform.isPad ? "" : "w-1/4"} mx-auto grid grid-cols-3 gap-1 justify-center`}>

                    {/* ✅ Add this conditional check */}
                    {Macros && (
                        <View className="flex-col"> {/* Use flex-col to stack the rows */}
                            <View className="flex-row justify-between">
                                <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-green-500 font-psemibold`}>Protein: </Text>
                                <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-right text-green-500 font-psemibold`}>{Macros.Protein}g</Text>
                            </View>
                            <View className="flex-row justify-between"> {/* Changed from justify-evenly */}
                                <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-red-500 font-psemibold`}>Fats:</Text>
                                <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-red-500 font-psemibold`}>{Macros.Fats}g</Text>
                            </View>
                            <View className="flex-row justify-between">
                                <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-blue-500 font-psemibold`}>Carbs: </Text>
                                <Text className={`${Platform.isPad ? "text-2xl" : "text-lg"} text-right text-blue-500 font-psemibold`}>{Macros.Carbs}g</Text>
                            </View>
                        </View>
                    )}

                    {/* Or you can use a loading indicator */}
                    {!Macros && <ActivityIndicator size="large" />}
                    
                </View>
                  <View className="mx-auto">
                    {/* ✅ Conditional check: Render the chart only if Macros is not null */}
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




        <CustomBTN
        Title="Sign Out"
        handlePress={ handleSignOut }
        width={200}
        otherStyles={"mt-5"}
        />
          <View className="flex-1 justify-center items-center">
          {loading ? (
            <ActivityIndicator size="large" className="mt-5" color="#FFC300" />
          ) : (
            <Text className="text-2xl text-white font-bold text-center mt-5">
              Welcome {userFitnessData?.firstName || "User"}
            </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}