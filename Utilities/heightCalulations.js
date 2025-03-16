const convertToInches = (heightStr) => {
    // Remove spaces and extract feet and inches using regex
    const match = heightStr.match(/^(\d+)'(\d+)"?$/);
    
    if (!match) {
        console.log("height: " , heightStr);
      console.error("Invalid height format");
      return null;
    }
  
    const feet = parseInt(match[1], 10);  // Extract feet
    const inches = parseInt(match[2], 10); // Extract inches
  
    return feet * 12 + inches;  // Convert to total inches
  };
  
  // Export the function
  export default convertToInches;
  