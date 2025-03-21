import axios from 'axios';

export const getCodeForcesQuestions = async () => {
    try {
        const response = await axios.get(
            'https://codeforces.com/api/problemset.problems?format=json',
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const getProblemsLeetcode = async () => {
    try {
        const response = await axios.post(
            'https://leetcode.com/graphql/',
            {
                query: `
                    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
                        problemsetQuestionList: questionList(
                            categorySlug: $categorySlug
                            limit: $limit
                            skip: $skip
                            filters: $filters
                        ) {
                            total: totalNum
                            questions: data {
                                acRate
                                difficulty
                                freqBar
                                frontendQuestionId: questionFrontendId
                                isFavor
                                paidOnly: isPaidOnly
                                status
                                title
                                titleSlug
                                topicTags {
                                    name
                                    id
                                    slug
                                }
                                hasSolution
                                hasVideoSolution
                            }
                        }
                    }
                `,
                variables: {
                    categorySlug: "all-code-essentials",
                    skip: 0,
                    limit: 99999,
                    filters: {}
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const slugify = (str: string): string => {
    if (!str) return '';
    return str
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
};

export const namlize = (str: string): string => {
    return str
        .toLowerCase()
        .split(/[\s-_]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}