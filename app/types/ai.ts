export interface RecommendedModule {
    ID: string;
    Module_Name: string;
    Description: string;
    Score: number;
    AI_Reason: string;
    Details: {
        ects: number;
        location: string;
    };
}
