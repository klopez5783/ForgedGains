import { Dimensions, Platform, View } from "react-native";
import Svg, { Circle, Path, Text } from "react-native-svg";

const { width, height } = Dimensions.get("window");

export default function PieChart({ Data = {"Fats" : 50 , "Carbs" : 200 , "Protein" : 150} , Calories = 1600}) {

  const cx = 50, cy = 50, r = 45; // Center and radius of the circle
  
  let startAngle = 0; // Starting angle for the first segment
  let paths = []; // Array to hold the path data for each segment
  const colors = ["#db1c0b", "#0b38db", "#0e9933"]; // Colors for slices

  const total = Object.values(Data).reduce((acc, value) => acc + value, 0);
  const angles = Object.values(Data).map((value) => (value / total) * 360);

  

  function anglesToCoordinates(angles, cx = 50, cy = 50, r = 45) {
    return angles.map(angle => {
        let radians = (angle - 90) * (Math.PI / 180); // Convert degrees to radians & shift 90° to start at the top
        let x = cx + r * Math.cos(radians);
        let y = cy + r * Math.sin(radians);
        return { x, y };
     });
  }

  const coordinates = anglesToCoordinates(angles);
  


  coordinates.forEach((coord, index) => {
    const angle = angles[index]; 
    const endAngle = startAngle + angle;

    // Convert angles to radians
    const startRadians = (Math.PI / 180) * startAngle;
    const endRadians = (Math.PI / 180) * endAngle;

    // Calculate start point
    const x1 = cx + r * Math.cos(startRadians);
    const y1 = cy + r * Math.sin(startRadians);

    // Calculate end point
    const x2 = cx + r * Math.cos(endRadians);
    const y2 = cy + r * Math.sin(endRadians);

    // Large Arc Flag (1 if angle > 180)
    const largeArcFlag = angle > 180 ? 1 : 0;

    // Create path for the slice
    const pathData = `
    M ${cx},${cy} 
    L ${x1},${y1} 
    A ${r},${r} 0 ${largeArcFlag} 1 ${x2},${y2} 
    Z
    `;

    paths.push(<Path key={index} d={pathData} fill={colors[index]} />);
    startAngle = endAngle; // Move to next slice
});

  
  return (
  <View style={{ width: "100%", alignItems: "center", justifyContent: "center" }}>
    <Svg
      height={Platform.isPad ? height * 0.12 : height * 0.10}
      width={Platform.isPad ? width * 0.30 : width * 0.35}
      viewBox="0 0 100 100"
    >
      {paths}
      <Circle cx={cx} cy={cy} r="35" stroke="#1F1F22" fill="#1F1F22" />
      <Text
        x={cx}
        y={cy - 5}
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        fill="white"
      >
        {Calories}
      </Text>
      <Text
        x={cx}
        y={cy + 15}
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        fill="white"
      >
        kcal
      </Text>
    </Svg>
  </View>
);
}

