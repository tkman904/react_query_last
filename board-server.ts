import express from "express";
//import express, {Application, Request, Response} from "express";
import cors from "cors";
import oracledb, {Connection} from "oracledb";

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
}));

app.use(express.json());

app.listen(3355, () => {
    console.log("Server is running:", "http://localhost:3355");
});

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT

async function getConnection() {
    return await oracledb.getConnection({
        user: "hr",
        password: "happy",
        connectionString: "211.238.142.22:1521/xe"
    })
}

// 리스트
app.get("/board/list_node", async (req, res) => {
    let conn

    const page = parseInt(req.query.page as string) || 1
    const rowSize = 10
    const start = (page - 1) * rowSize

    try {
        conn = await getConnection();

        const listSql =
            `
                SELECT no, subject, name, TO_CHAR(regdate, 'YYYY-MM-DD') AS dbday, hit
                FROM board_1
                ORDER BY no DESC
                OFFSET ${start} ROWS FETCH NEXT 10 ROWS ONLY
            `

        const totalSql =
            `
                SELECT CEIL(COUNT(*)/10.0) AS totalpage
                FROM board_1
            `
        const result = await conn.execute(listSql)
        const total = await conn.execute(totalSql)
        const totalpage = (total.rows as {TOTALPAGE: number}[])[0].TOTALPAGE
        res.json({
            curpage: page,
            totalpage,
            list: result.rows
        })
    } catch (error) {
        console.log(error)
    } finally {
        if(conn) {
            await conn.close()
        }
    }
})

// 글쓰기
app.post("/board/insert_node", async (req, res) => {
    let conn
    const {name, subject, content, pwd} = req.body;

    try {
        conn = await getConnection();
        const sql =
            `
                INSERT INTO board_1 (no, name, subject, content, pwd)
                VALUES (BR1_NO_SEQ.nextval, :name, :subject, :content, :pwd)
            `
        await conn.execute(
            sql,
            {name, subject, content, pwd},
            {autoCommit: true}
        )
        res.json({msg: 'yes'})
    } catch(err) {
        console.log(err)
        res.status(500).json({msg: 'no'})
    } finally {
        if(conn) {
            await conn.close()
        }
    }
})

// 상세보기
app.get("/board/detail_node", async (req, res) => {
    let conn
    const no = Number(req.query.no)

    try {
        conn = await getConnection()
        const sql1 =
            `
                UPDATE board_1 SET
                hit = hit+1
                WHERE no = :no
            `
        await conn.execute(
            sql1,
            {no},
            {autoCommit: true}
        )

        const sql2 =
            `
                SELECT no, subject, TO_CHAR(content) AS content, name, hit, TO_CHAR(regdate, 'YYYY-MM-DD') AS dbday
                FROM board_1
                WHERE no = :no
            `
        const result = await conn.execute(
            sql2,
            {no}
        )

        res.json(result.rows?.[0])
    } catch(error) {
        console.log(error)
    } finally {
        if(conn) {
            await conn.close()
        }
    }
})