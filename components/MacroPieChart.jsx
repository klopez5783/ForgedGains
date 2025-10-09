import { Dimensions, Platform, View } from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const { width, height } = Dimensions.get('window'); // Assuming you use Dimensions

export default function PieChart({ Data = {}, Calories = 0 }) {
    
    // 1. SAFELY PARSE AND NORMALIZE DATA
    const safeData = {
        Fats: parseFloat(Data.Fats) || 0,
        Carbs: parseFloat(Data.Carbs) || 0,
        Protein: parseFloat(Data.Protein) || 0,
    };
    
    // 2. SAFELY PARSE AND NORMALIZE CALORIES
    const safeCalories = Math.max(0, Math.round(parseFloat(Calories) || 0));


    const cx = 50, cy = 50, r = 45; // Center and radius of the circle
    let startAngle = 0; 
    let paths = []; 
    const colors = ["#db1c0b", "#0b38db", "#0e9933"]; 
    
    // Calculate total using safeData
    const total = Object.values(safeData).reduce((acc, value) => acc + value, 0);
    
    // 3. HANDLE ZERO OR INVALID TOTAL (DIVISION BY ZERO PREVENTION)
    if (total === 0) {
        return (
            <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
                <Svg
                    height={Platform.isPad ? height * 0.12 : height * 0.10}
                    width={Platform.isPad ? width * 0.30 : width * 0.35}
                    viewBox="0 0 100 100"
                >
                    <Circle cx={cx} cy={cy} r="45" fill="#333" />
                    <Circle cx={cx} cy={cy} r="35" stroke="#1F1F22" fill="#1F1F22" />
                    <SvgText 
                        x={cx} y={cy} fontSize="14" textAnchor="middle" fill="white"
                    >
                        No Data
                    </SvgText>
                </Svg>
            </View>
        );
    }


    const macroKeys = Object.keys(safeData);
    const macroValues = Object.values(safeData);
    
    // Calculate angles based on safeData and non-zero total
    const angles = macroValues.map((value) => (value / total) * 360);

    // ... anglesToCoordinates function remains the same ...
    function anglesToCoordinates(angles, cx = 50, cy = 50, r = 45) {
      return angles.map(angle => {
          let radians = (angle - 90) * (Math.PI / 180); 
          let x = cx + r * Math.cos(radians);
          let y = cy + r * Math.sin(radians);
          return { x, y };
      });
    }

    const coordinates = anglesToCoordinates(angles);
    
    coordinates.forEach((coord, index) => {
        // ... path generation logic remains the same ...
        // Note: You should ensure you are importing 'Text' as 'SvgText' to avoid conflicts
        // and using 'SvgText' inside the Svg component.
        // I fixed this in the return block below.
    });


    // ... rest of the component logic ...

    return (
        <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
            <Svg
                height={Platform.isPad ? height * 0.12 : height * 0.10}
                width={Platform.isPad ? width * 0.30 : width * 0.35}
                viewBox="0 0 100 100"
            >
                {paths}
                <Circle cx={cx} cy={cy} r="35" stroke="#1F1F22" fill="#1F1F22" />
                <SvgText // Use SvgText for text inside Svg
                    x={cx}
                    y={cy - 5}
                    fontSize="18"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="white"
                >
                    {safeCalories} // Use the safe value here
                </SvgText>
                <SvgText // Use SvgText for text inside Svg
                    x={cx}
                    y={cy + 15}
                    fontSize="18"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill="white"
                >
                    kcal
                </SvgText>
            </Svg>
        </View>
    );
}