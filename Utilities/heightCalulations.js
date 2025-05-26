export const convertToInches = (heightStr) => {
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

export const convertToHeightString = (inches) => {
    if (isNaN(inches) || inches < 0) {
        console.error("Invalid inches value");
        return null;
    }

    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;

    return `${feet}'${remainingInches}"`;
};

// Example function to validate height input format
export const isValidHeightFormat = (heightStr) => {
    return /^(\d+)'(\d+)"?$/.test(heightStr);
};