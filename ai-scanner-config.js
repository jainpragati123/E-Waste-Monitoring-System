// AI Scanner Configuration
const AI_SCANNER_CONFIG = {
    // Google Cloud Vision API settings
    API_KEY: 'YOUR_GOOGLE_CLOUD_API_KEY', // Replace with your actual API key
    API_ENDPOINT: 'https://vision.googleapis.com/v1/images:annotate',
    
    // Waste type mappings for common electronic items
    WASTE_TYPES: {
        'laptop': {
            category: 'e-waste',
            materials: ['Plastic', 'Metal', 'Glass', 'Battery'],
            recyclingSteps: [
                'Remove the battery if possible',
                'Back up and wipe personal data',
                'Remove any detachable parts',
                'Take to certified e-waste recycling center'
            ],
            environmentalImpact: {
                co2Saved: 160,
                waterSaved: 1900,
                materialsRecovered: ['Gold', 'Silver', 'Copper', 'Plastic']
            }
        },
        'smartphone': {
            category: 'e-waste',
            materials: ['Glass', 'Plastic', 'Metal', 'Battery'],
            recyclingSteps: [
                'Remove the battery if possible',
                'Wipe personal data',
                'Remove SIM card',
                'Take to certified e-waste recycling center'
            ],
            environmentalImpact: {
                co2Saved: 45,
                waterSaved: 500,
                materialsRecovered: ['Gold', 'Silver', 'Rare Earth Metals']
            }
        },
        'tablet': {
            category: 'e-waste',
            materials: ['Glass', 'Plastic', 'Metal', 'Battery'],
            recyclingSteps: [
                'Remove the battery if possible',
                'Wipe personal data',
                'Remove any detachable parts',
                'Take to certified e-waste recycling center'
            ],
            environmentalImpact: {
                co2Saved: 80,
                waterSaved: 1000,
                materialsRecovered: ['Gold', 'Silver', 'Glass']
            }
        },
        'television': {
            category: 'e-waste',
            materials: ['Glass', 'Plastic', 'Metal', 'Electronics'],
            recyclingSteps: [
                'Remove any detachable parts',
                'Check for hazardous materials',
                'Take to certified e-waste recycling center'
            ],
            environmentalImpact: {
                co2Saved: 200,
                waterSaved: 2500,
                materialsRecovered: ['Glass', 'Plastic', 'Metal']
            }
        },
        'battery': {
            category: 'hazardous',
            materials: ['Metal', 'Chemical Compounds'],
            recyclingSteps: [
                'Do not dispose in regular trash',
                'Take to battery recycling center',
                'Handle with care - contains hazardous materials'
            ],
            environmentalImpact: {
                co2Saved: 30,
                waterSaved: 300,
                materialsRecovered: ['Metal', 'Chemical Compounds']
            }
        }
    },

    // Confidence threshold for waste detection
    CONFIDENCE_THRESHOLD: 0.7,

    // Default response for unknown items
    DEFAULT_RESPONSE: {
        category: 'unknown',
        materials: ['Unknown'],
        recyclingSteps: [
            'Please consult local recycling guidelines',
            'Contact waste management authorities'
        ],
        environmentalImpact: {
            co2Saved: 0,
            waterSaved: 0,
            materialsRecovered: ['Unknown']
        }
    }
};

// Export the configuration
export default AI_SCANNER_CONFIG; 