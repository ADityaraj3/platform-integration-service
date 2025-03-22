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

export const getProblemsHackerank = async (offset: number) => {
    try {

        const headers = {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'pragma': 'no-cache',
            'priority': 'u=0, i',
            'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"macOS"',
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'none',
            'sec-fetch-user': '?1',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
            'Cookie': 'hackerrank_mixpanel_token=a5d0fb75-3277-48db-8220-f44f9099337b; hrc_l_i=F'
        };

        const response = await axios.get(
            `https://www.hackerrank.com/rest/contests/master/tracks/algorithms/challenges?offset=${offset}&limit=10000000`,
            { headers }
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const getProblemsGeeksForGeeks = async (page: number) => {
    try {
        const response = await axios.get(
            `https://practiceapi.geeksforgeeks.org/api/vr/problems/?pageMode=explore&page=${page}&sortBy=latest`
        );
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

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

