export interface RecommendedModule {
    ID: string;
    "Module Naam": string;
    Score: number;
    AI_Reden: string;
    Details: {
        ects: number;
        location: string;
    };
}
