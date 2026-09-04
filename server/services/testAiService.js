const { extractWithAI } = require("./aiService");


async function test() {

    const resumeText = `
    Anuja Sharma worked at ABC Technologies
    in Bangalore.
    She developed REST APIs using Node.js and MongoDB.
    `;


    try {

        const result = await extractWithAI(resumeText);

        console.log(
            "\n===== AI SERVICE RESPONSE ====="
        );

        console.log(
            JSON.stringify(result, null, 2)
        );

    } catch (error) {

        console.error(error.message);

    }
}


test();