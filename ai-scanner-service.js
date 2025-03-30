import AI_SCANNER_CONFIG from './ai-scanner-config.js';

class AIScannerService {
    constructor() {
        this.config = AI_SCANNER_CONFIG;
    }

    async analyzeImage(imageData) {
        try {
            // Prepare the request for Google Cloud Vision API
            const requestBody = {
                requests: [{
                    image: {
                        content: imageData.split(',')[1] // Remove data URL prefix
                    },
                    features: [
                        { type: 'LABEL_DETECTION', maxResults: 10 },
                        { type: 'OBJECT_LOCALIZATION', maxResults: 10 }
                    ]
                }]
            };

            // Make API request
            const response = await fetch(`${this.config.API_ENDPOINT}?key=${this.config.API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            return this.processAPIResponse(data);
        } catch (error) {
            console.error('Error analyzing image:', error);
            return this.config.DEFAULT_RESPONSE;
        }
    }

    processAPIResponse(apiResponse) {
        const labels = apiResponse.responses[0].labelAnnotations || [];
        const objects = apiResponse.responses[0].localizedObjectAnnotations || [];

        // Combine labels and objects for better detection
        const allDetections = [
            ...labels.map(label => ({
                name: label.description.toLowerCase(),
                confidence: label.score
            })),
            ...objects.map(obj => ({
                name: obj.name.toLowerCase(),
                confidence: obj.score
            }))
        ];

        // Find the best matching waste type
        let bestMatch = null;
        let highestConfidence = 0;

        for (const detection of allDetections) {
            for (const [wasteType, wasteInfo] of Object.entries(this.config.WASTE_TYPES)) {
                if (detection.name.includes(wasteType) && detection.confidence > highestConfidence) {
                    highestConfidence = detection.confidence;
                    bestMatch = wasteType;
                }
            }
        }

        // Return waste info if confidence is high enough
        if (bestMatch && highestConfidence >= this.config.CONFIDENCE_THRESHOLD) {
            return {
                ...this.config.WASTE_TYPES[bestMatch],
                confidence: highestConfidence,
                detectedType: bestMatch
            };
        }

        // Return default response if no good match found
        return {
            ...this.config.DEFAULT_RESPONSE,
            confidence: highestConfidence,
            detectedType: 'unknown'
        };
    }

    // Helper method to convert image to base64
    async imageToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

// Export the service
export default new AIScannerService(); 