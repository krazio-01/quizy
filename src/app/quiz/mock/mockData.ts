export interface Question {
    code: string;
    questionText: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

export interface GradeQuestionSet {
    grade: string;
    questions: Question[];
}

export const gradeWiseQuestions: GradeQuestionSet[] = [
    {
        grade: '3-4',
        questions: [
            {
                code: '71172',
                questionText:
                    'In a code language, A=1, B=2, C=3,...,Y=25, Z=26. In this language, CAT is written as "3-1-20". Which word does the code "14-15-4-5" represent?',
                options: ['MOON', 'MUSE', 'NODE', 'NONE'],
                correctAnswerIndex: 2,
                explanation: 'N=14 O=15 D=4 E=5',
            },
            {
                code: '71136',
                questionText:
                    'Spark likes letters like A, B, C, D more than math symbols like +, -, x, ÷. So, he decides to replace "+" and "-" with A and B: A is "+", B is "-". As per this new rule, what would be the value of "12 A 16 B 1"?',
                options: ['24', '27', '30', '32'],
                correctAnswerIndex: 1,
                explanation: '12 + 16 - 1 = 27',
            },
            {
                code: '71137',
                questionText:
                    'Spark likes letters like A, B, C, D more than math symbols like +, -, x, ÷. So, he decides to replace "+" and "-" with A and B: A is "+", B is "-". Spark wants to get his favourite number "9". Which of the following will NOT result in 9?',
                options: ['7 A 5 B 3', '9 A 9 B 9', '9 A 3 B 6', '13 A 2 B 6'],
                correctAnswerIndex: 2,
                explanation: "9 A 3 B 6 = 9 + 3 - 6 = 6. This is the only expression that doesn't yield 9",
            },
            {
                code: '71129',
                questionText:
                    'A palindrome is a word that is the same whether you read it from left to right or right to left. E.g. EYE, MADAM, and REFER. In which of the given options are all 3 words palindromes?',
                options: ['LEVEL, RADAR, POTATO', 'ROTOR, STAR, RIVER', 'TENET, NOON, PAPER', 'CIVIC, KAYAK, LEVEL'],
                correctAnswerIndex: 3,
                explanation: 'CIVIC, KAYAK, LEVEL - all 3 are palindromic',
            },
            {
                code: '71130',
                questionText:
                    'A palindrome is a word that is the same whether you read it from left to right or right to left. Sentences can also be palindromes, if you ignore spaces, commas, full stops and question marks. What word will you fill in the blank to make the sentence below a palindrome? WAS IT A ____ I SAW?',
                options: ['STAR', 'CAT', 'TART', 'WOW'],
                correctAnswerIndex: 1,
                explanation: 'WASITACATISAW is the palindrome',
            },
        ],
    },
    {
        grade: '5-6',
        questions: [
            {
                code: '71169',
                questionText:
                    'Runner lives on the 29th floor and chooses a different floor to get off the elevator every day, following rules: never repeat a floor, avoid same parity (even/odd) on consecutive days, and avoid repeating tens digit. Which of the following sequences could be valid: 13, 28, 7, 18, 21, 2, 17?',
                options: [
                    '2, 13, 8, 23, 22, 7, 12',
                    '13, 28, 7, 18, 21, 2, 17',
                    '18, 27, 12, 3, 15, 30',
                    '19, 4, 17, 22, 17, 6',
                ],
                correctAnswerIndex: 1,
                explanation:
                    'All rules are satisfied in the option: no repetition, alternates between even and odd, tens digits change.',
            },
            {
                code: '71170',
                questionText:
                    'Runner exits the elevator on floors: 12, 23, 2, 15, 9, 22, 17 from Sunday to Saturday. Which rule is violated?',
                options: ['Rule 1', 'Rule 2', 'Rule 3', 'Rule 4'],
                correctAnswerIndex: 2,
                explanation: '15 and 9 are both odd floors on consecutive days, violating Rule 3.',
            },
            {
                code: '71138',
                questionText:
                    'In a secret language, "fruga" means "roses". Given this and other phrase translations, what is the word for "pretty"?',
                options: ['Wee', 'Frey', 'Zee', 'Cannot be determined'],
                correctAnswerIndex: 1,
                explanation: 'Wee is "are", Zee is "flowers", so "Frey" must be "pretty".',
            },
            {
                code: '71139',
                questionText:
                    'Based on the code language, which of the following could mean "pink flowers are pretty"?',
                options: ['Qrip zee frey wee', 'Zee qrip frey be', 'Zee qrip frey wee', 'Zee qrip be wee'],
                correctAnswerIndex: 2,
                explanation:
                    '"Qrip" is pink, "Zee" is flowers, "Wee" is are, and "Frey" is pretty. So the correct sentence must include these and no other word.',
            },
            {
                code: '71180',
                questionText:
                    'Sunny plants flowers with rules: starts with Tulip, Rose must be followed by Sunflower, no 2 Tulips in a row, max 2 Sunflowers together. Which option follows all rules?',
                options: [
                    'Tulip, Rose, Sunflower, Tulip, Tulip, Sunflower',
                    'Tulip, Sunflower, Rose, Tulip, Sunflower, Rose',
                    'Tulip, Sunflower, Tulip, Rose, Tulip, Sunflower',
                    'Tulip, Sunflower, Rose, Sunflower, Tulip, Sunflower',
                ],
                correctAnswerIndex: 2,
                explanation:
                    'Only option C obeys all constraints: starts with Tulip, no double Tulips, Rose is followed by Sunflower, no 3 Sunflowers together.',
            },
        ],
    },
    {
        grade: '7-8',
        questions: [
            {
                code: '71119',
                questionText:
                    'If the digits of the number 26839514 are arranged in descending order, how many digits will stay in the same position as before?',
                options: ['Zero', 'One', 'Two', 'Three'],
                correctAnswerIndex: 0,
                explanation:
                    'Descending: 98654321. None of the digits are in the same position as the original number.',
            },
            {
                code: '71121',
                questionText:
                    'Four children – Glow, Rush, Snap and Zap – are climbing a ladder. Clues: Glow is higher than Rush; Rush is between Glow and Snap; Zap is higher than Glow. Who is second from the bottom?',
                options: ['Rush', 'Snap', 'Glow', 'Zap'],
                correctAnswerIndex: 1,
                explanation: 'Order from top to bottom: Zap > Glow > Rush > Snap. So, Snap is second from the bottom.',
            },
            {
                code: '71123',
                questionText:
                    'The water image of an object is a top-to-bottom flipped version of it. Which option represents the water image of the figure below?',
                options: ['A', 'B', 'C', 'D'],
                correctAnswerIndex: 1,
                explanation: 'Correct flipping vertically gives option B.',
            },
            {
                code: '71152',
                questionText:
                    'A figure made of identical blocks is shown. Which of the options could be another view of the same figure?',
                options: ['A', 'B', 'C', 'D'],
                correctAnswerIndex: 2,
                explanation: 'Only option C shows the same structure from another angle.',
            },
            {
                code: '71176',
                questionText:
                    '1 octopus, 3 rats, 2 starfish and 4 dolphins vote. Octopus = 8 hands, rats = 2 hands each, starfish = 5 hands, dolphins = 0. Total votes for Mr. Brave?',
                options: ['19', '28', '34', '38'],
                correctAnswerIndex: 2,
                explanation: 'Votes = 8 (octopus) + 6 (rats) + 10 (starfish) + 0 = 24 total votes.',
            },
        ],
    },
    {
        grade: '9-10',
        questions: [
            {
                code: '71154',
                questionText: `A box has 4 colored caps: red, blue, green, yellow. Bolt, Twist, Misty pick caps with closed eyes. Clues: No one gets their fav color. Bolt doesn't have blue/red. Twist doesn't have red. Misty's fav is yellow. Green is still in the box. What cap does each friend get?`,
                options: [
                    'Bolt: Red, Twist: Yellow, Misty: Blue',
                    'Bolt: Yellow, Twist: Blue, Misty: Red',
                    'Bolt: Yellow, Twist: Red, Misty: Blue',
                    'Bolt: Blue, Twist: Red, Misty: Yellow',
                ],
                correctAnswerIndex: 2,
                explanation: 'Only C satisfies all conditions and cap-to-person logic.',
            },
            {
                code: '71155',
                questionText:
                    'A special die has letters P, Q, R, S, T, U which map to numbers 1–6. Jumper is on square 2, Nutty on 6. Jumper rolls and lands on Nutty. What letter did she roll?',
                options: ['Q', 'S', 'T', 'U'],
                correctAnswerIndex: 1,
                explanation: '6 - 2 = 4 steps → letter S (4)',
            },
            {
                code: '71157',
                questionText: `Texty wants to arrange these books from newest to oldest: Winnie the Pooh, The Hobbit, Charlotte's Web. Clues: Winnie is not newest, Charlotte is oldest, Hobbit is not oldest. What's the order?`,
                options: [
                    "Winnie the Pooh, The Hobbit, Charlotte's Web",
                    "Charlotte's Web, Winnie the Pooh, The Hobbit",
                    "The Hobbit, Charlotte's Web, Winnie the Pooh",
                    "The Hobbit, Winnie the Pooh, Charlotte's Web",
                ],
                correctAnswerIndex: 3,
                explanation: 'Only D fits: Hobbit (newest), then Winnie, then Charlotte (oldest).',
            },
            {
                code: '71173',
                questionText: 'A fruit basket has 50 fruits. 20 apples. Bananas = 2× oranges. How many oranges?',
                options: ['5', '10', '15', '20'],
                correctAnswerIndex: 1,
                explanation: 'Let oranges = x, bananas = 2x. So 20 + x + 2x = 50 → x = 10.',
            },
            {
                code: '71175',
                questionText: `A car follows these directions: 3rd right → 1st right → 1st left → 1st right again → Parking is on right. Which slot will it park in?`,
                options: ['A', 'B', 'C', 'D'],
                correctAnswerIndex: 3,
                explanation: 'Following the path correctly leads to parking slot D.',
            },
        ],
    },
];
