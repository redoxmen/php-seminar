// ============================================================
//  LESSONS DATA — all 17 topics live here.
//  Add / edit / reorder topics in this one file; the page
//  renders every topic automatically from this array.
//
//  Fields:
//    num     – display number (string, keeps leading zero)
//    id      – url-safe anchor id
//    title   – topic title
//    blurb   – one-line explanation under the title
//    simple  – "In simple words" callout
//    points  – key points bullet list
//    code    – [{ label, lang, code }] rendered with copy button
//    output  – example result text (optional)
//    flow    – vertical animated flow [{ label, sub, color }] (optional)
//    scene   – special visual section key (optional)
// ============================================================

export const lessons = [
  {
    num: '01',
    id: 'intro',
    title: 'Introduction to MySQLi',
    blurb:
      'MySQLi stands for MySQL Improved. It is a PHP extension used to communicate with MySQL databases.',
    simple:
      'Think of MySQLi as a bridge that lets your PHP code talk to a MySQL database — requests travel one way, data comes back the other.',
    points: [
      'The "Improved" replacement for the old mysql_* functions.',
      'Comes bundled with PHP — enable the mysqli extension and go.',
      'Works in two styles: procedural (functions) and object-oriented.',
      'Supports prepared statements, the main defence against SQL injection.',
    ],
    flow: [
      { label: 'PHP', sub: 'your code', color: 'coral' },
      { label: 'MySQLi', sub: 'the bridge', color: 'blue' },
      { label: 'MySQL', sub: 'the database', color: 'violet' },
    ],
  },
  {
    num: '02',
    id: 'procedural',
    title: 'Procedural MySQLi',
    blurb:
      'The procedural style uses plain functions — every call starts with mysqli_.',
    simple:
      'A to-do list for your code: connect, query, fetch, close. One step at a time, top to bottom.',
    points: [
      'mysqli_connect() opens the link to MySQL.',
      'mysqli_query() sends SQL to the database.',
      'mysqli_fetch_assoc() reads one row as an array.',
      'mysqli_close() politely ends the connection.',
    ],
    code: [
      {
        label: 'procedural.php',
        lang: 'php',
        code: `<?php
$conn = mysqli_connect("localhost", "root", "", "college");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$result = mysqli_query($conn, "SELECT * FROM students");

while ($row = mysqli_fetch_assoc($result)) {
    echo $row["name"] . " - " . $row["age"] . "<br>";
}

mysqli_close($conn);
?>`,
      },
    ],
  },
  {
    num: '03',
    id: 'oop',
    title: 'Object-Oriented MySQLi',
    blurb:
      'The OOP style wraps the same features in a mysqli object — same power, tidier syntax.',
    simple:
      'Instead of calling functions, you create one database object and call methods on it with ->.',
    points: [
      'new mysqli() creates the connection object.',
      '$conn->query() sends SQL to the database.',
      '$result->fetch_assoc() reads one row.',
      '$conn->close() ends the connection.',
    ],
    code: [
      {
        label: 'object-oriented.php',
        lang: 'php',
        code: `<?php
$conn = new mysqli("localhost", "root", "", "college");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = $conn->query("SELECT * FROM students");

while ($row = $result->fetch_assoc()) {
    echo $row["name"] . " - " . $row["age"] . "<br>";
}

$conn->close();
?>`,
      },
    ],
    scene: 'compare',
  },
  {
    num: '04',
    id: 'connecting',
    title: 'Connecting PHP to MySQL',
    blurb:
      'mysqli_connect() needs four things: host, username, password and database name.',
    simple:
      'Like dialling a phone number: the host is the switchboard, the user and password are your ID, and the database is who you want to talk to.',
    points: [
      'host — "localhost" means MySQL runs on the same machine.',
      'username / password — XAMPP defaults are "root" with an empty password.',
      'database — the specific database you want to use, e.g. "college".',
      'Always check the connection before running any query.',
    ],
    code: [
      {
        label: 'connect.php',
        lang: 'php',
        code: `<?php
$conn = mysqli_connect(
    "localhost",   // host
    "root",        // username
    "",            // password
    "college"      // database
);

if (!$conn) {
    die("Connection failed");
}
?>`,
      },
    ],
  },
  {
    num: '05',
    id: 'queries',
    title: 'Executing Queries Using MySQLi',
    blurb:
      'mysqli_query() delivers your SQL to MySQL and brings back a result object.',
    simple:
      'You write the SQL, MySQLi delivers it to MySQL, and hands you back the receipt.',
    points: [
      'SELECT returns a mysqli_result you can read row by row.',
      'INSERT, UPDATE and DELETE return true or false.',
      'Always store the result and check it before using it.',
      'mysqli_num_rows($result) tells you how many rows came back.',
    ],
    code: [
      {
        label: 'query.php',
        lang: 'php',
        code: `<?php
$conn = mysqli_connect("localhost", "root", "", "college");

// A query that RETURNS data
$result = mysqli_query($conn, "SELECT * FROM students");

// A query that CHANGES data
$status = mysqli_query(
    $conn,
    "INSERT INTO students (name, age) VALUES ('Arun', 20)"
);

if ($status) {
    echo "New record created!";
}
?>`,
      },
    ],
  },
  {
    num: '06',
    id: 'crud',
    title: 'CRUD Operations',
    blurb:
      'Every application does four things with data: Create, Read, Update, Delete — CRUD.',
    simple:
      'A to-do app in four verbs: add tasks (INSERT), show tasks (SELECT), tick them off (UPDATE), throw them away (DELETE).',
    points: [],
    scene: 'crud',
  },
  {
    num: '07',
    id: 'retrieving',
    title: 'Retrieving Records',
    blurb:
      'SELECT hands you a result object — fetch functions turn each row into a PHP array.',
    simple:
      'The result is a train full of rows: fetch_assoc() walks along it, one carriage at a time.',
    points: [
      'fetch_assoc() returns one row as an associative array.',
      'A while loop keeps fetching until there are no rows left.',
      'fetch_all(MYSQLI_ASSOC) grabs every row in one go.',
      'mysqli_num_rows() counts the rows before you loop.',
    ],
    code: [
      {
        label: 'retrieve.php',
        lang: 'php',
        code: `<?php
$result = mysqli_query($conn, "SELECT * FROM students");

// One row at a time
while ($row = mysqli_fetch_assoc($result)) {
    echo $row["id"] . " | " . $row["name"] . " | " . $row["age"] . "<br>";
}

// Or everything at once
$rows = mysqli_fetch_all($result, MYSQLI_ASSOC);
echo mysqli_num_rows($result) . " students found";
?>`,
      },
    ],
    output: `1 | Arun | 20
2 | Diya | 21
3 | Kumar | 19
3 students found`,
  },
  {
    num: '08',
    id: 'errors',
    title: 'Handling Database Errors',
    blurb:
      'Things go wrong — MySQLi gives you functions that tell you exactly what happened.',
    simple:
      'When the bridge is broken, mysqli_connect_error() and mysqli_error() are the repair team that shows you where the crack is.',
    points: [
      'mysqli_connect_error() — reports connection failures.',
      'mysqli_error($conn) — reports the last query’s mistake.',
      'mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT) — throw exceptions while developing.',
      'Typical errors: connection refused, unknown database, unknown table, unknown column, SQL syntax.',
    ],
    code: [
      {
        label: 'errors.php',
        lang: 'php',
        code: `<?php
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

try {
    $conn = mysqli_connect("localhost", "root", "", "college");

    $result = mysqli_query($conn, "SELECT * FROM studnets"); // typo!
} catch (mysqli_sql_exception $e) {
    echo "Query error: " . $e->getMessage();
}
?>`,
      },
    ],
    scene: 'errors',
  },
  {
    num: '09',
    id: 'prepared',
    title: 'Prepared Statements',
    blurb:
      'Prepared statements send the SQL and the data separately, so data can never change the query’s meaning.',
    simple:
      'The query template is baked first, then user input is poured in as filling — it can never rewrite the recipe.',
    points: [
      '? is a placeholder where real values are attached later.',
      'prepare() → bind_param() → execute() → get_result().',
      '"ssi" means string, string, integer — one letter per value.',
      'The single most important defence against SQL injection.',
    ],
    code: [
      {
        label: 'prepared.php',
        lang: 'php',
        code: `<?php
$stmt = mysqli_prepare(
    $conn,
    "SELECT * FROM students WHERE course = ? AND age > ?"
);

mysqli_stmt_bind_param($stmt, "si", $course, $minAge);

$course = "BCA";
$minAge = 18;

mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

while ($row = mysqli_fetch_assoc($result)) {
    echo $row["name"] . "<br>";
}
?>`,
      },
    ],
    scene: 'security',
  },
  {
    num: '10',
    id: 'injection',
    title: 'SQL Injection',
    blurb:
      'SQL injection is when user input tricks your query into running extra, dangerous SQL.',
    simple:
      'If you paste user text straight into SQL, a hacker can type a sentence that ends your query and starts their own.',
    points: [
      'Classic payload: \' OR \'1\'=\'1 — makes every row match.',
      'Building SQL by joining strings is the open door.',
      'Prepared statements close that door completely.',
      'Also: validate input and give your app a limited database user.',
    ],
    code: [
      {
        label: 'injection.php',
        lang: 'php',
        code: `<?php
// UNSAFE — input is glued into the SQL
$user = "' OR '1'='1";
$sql  = "SELECT * FROM users WHERE name = '$user'";
// becomes: SELECT * FROM users WHERE name = '' OR '1'='1'
// → returns EVERY user!

// SAFE — prepared statement
$stmt = mysqli_prepare($conn, "SELECT * FROM users WHERE name = ?");
mysqli_stmt_bind_param($stmt, "s", $user);
mysqli_stmt_execute($stmt);
?>`,
      },
    ],
  },
  {
    num: '11',
    id: 'json',
    title: 'JSON with PHP',
    blurb:
      'json_encode() turns PHP arrays into JSON text; json_decode() turns JSON back into PHP.',
    simple:
      'JSON is the universal lunchbox — PHP packs the data in, and JavaScript, Flutter or any mobile app can open it.',
    points: [
      'json_encode() = PHP → JSON.',
      'json_decode() = JSON → PHP (pass true to get arrays).',
      'Send header("Content-Type: application/json") when serving JSON.',
      'JSON keys are always wrapped in double quotes.',
    ],
    code: [
      {
        label: 'json.php',
        lang: 'php',
        code: `<?php
// PHP → JSON
$student = ["name" => "Arun", "age" => 20];
echo json_encode($student);
// {"name":"Arun","age":20}

// JSON → PHP
$json = '{"name":"Arun","age":20}';
$data = json_decode($json, true);
echo $data["name"]; // Arun
?>`,
      },
    ],
    output: `{
  "name": "Arun",
  "age": 20
}`,
    scene: 'json',
  },
  {
    num: '12',
    id: 'pipeline',
    title: 'PHP → MySQL → JSON',
    blurb:
      'The classic data pipeline: query MySQL, collect the rows in a PHP array, encode to JSON, respond.',
    simple:
      'PHP asks MySQL for rows, lines them up in an array, then ships them out as JSON.',
    points: [
      'mysqli_fetch_all() collects every row into one array.',
      'json_encode() prints the array as JSON text.',
      'Always set the Content-Type header before echoing.',
      'This tiny pattern is the heart of every PHP API.',
    ],
    code: [
      {
        label: 'pipeline.php',
        lang: 'php',
        code: `<?php
header("Content-Type: application/json");

$conn  = mysqli_connect("localhost", "root", "", "college");
$rows  = mysqli_fetch_all(
    mysqli_query($conn, "SELECT * FROM students"),
    MYSQLI_ASSOC
);

echo json_encode($rows);
?>`,
      },
    ],
    flow: [
      { label: 'PHP Array', sub: 'rows in memory', color: 'coral' },
      { label: 'json_encode()', sub: 'packed as text', color: 'blue' },
      { label: 'JSON', sub: 'universal format', color: 'violet' },
      { label: 'JavaScript / Flutter / App', sub: 'any client', color: 'coral' },
    ],
  },
  {
    num: '13',
    id: 'api',
    title: 'PHP APIs',
    blurb:
      'A PHP file can act as an API: the app sends an HTTP request, PHP answers with JSON.',
    simple:
      'students.php is the waiter — the app asks for students, the kitchen (MySQL) cooks, the waiter serves JSON.',
    points: [
      'The client calls GET /students.php.',
      'PHP queries MySQL through MySQLi.',
      'PHP echoes the rows as a JSON response.',
      'Any app — web, Android, iOS — can consume it.',
    ],
    code: [
      {
        label: 'students.php',
        lang: 'php',
        code: `<?php
header("Content-Type: application/json");

$conn = mysqli_connect("localhost", "root", "", "college");

$result = mysqli_query($conn, "SELECT id, name, age FROM students");
$rows   = mysqli_fetch_all($result, MYSQLI_ASSOC);

echo json_encode($rows);
?>`,
      },
    ],
    output: `GET /students.php → 200 OK

[
  { "id": 1, "name": "Arun",  "age": 20 },
  { "id": 2, "name": "Diya",  "age": 21 },
  { "id": 3, "name": "Kumar", "age": 19 }
]`,
    scene: 'api',
  },
  {
    num: '14',
    id: 'complete',
    title: 'Complete Working Example',
    blurb:
      'Everything together: one clean file that connects, queries, fetches, encodes and responds.',
    simple:
      'The whole journey in a single script — from connection string to JSON response.',
    points: [],
    steps: ['Connect', 'Query', 'Retrieve', 'Process', 'Convert to JSON', 'Respond'],
    code: [
      {
        label: 'complete.php',
        lang: 'php',
        code: `<?php
header("Content-Type: application/json");

// 1. CONNECT
$conn = mysqli_connect("localhost", "root", "", "college");
if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Connection failed"]);
    exit;
}

// 2. QUERY
$result = mysqli_query($conn, "SELECT id, name, age FROM students");

// 3. RETRIEVE
$rows = mysqli_fetch_all($result, MYSQLI_ASSOC);

// 4. PROCESS (example: sort by age)
usort($rows, fn($a, $b) => $a["age"] <=> $b["age"]);

// 5. CONVERT TO JSON + 6. RESPOND
echo json_encode([
    "success" => true,
    "count"   => count($rows),
    "students" => $rows,
]);

mysqli_close($conn);
?>`,
      },
    ],
    output: `{
  "success": true,
  "count": 3,
  "students": [
    { "id": 3, "name": "Kumar", "age": 19 },
    { "id": 1, "name": "Arun",  "age": 20 },
    { "id": 2, "name": "Diya",  "age": 21 }
  ]
}`,
  },
  {
    num: '15',
    id: 'vs-pdo',
    title: 'MySQLi vs PDO',
    blurb:
      'Both are modern ways to talk to databases — MySQLi speaks only MySQL; PDO speaks 12+ database dialects.',
    simple:
      'MySQLi is a MySQL specialist; PDO is a translator that works with almost any database.',
    points: [
      'Choose MySQLi when you are sure the project will always use MySQL.',
      'Choose PDO when the database might change (PostgreSQL, SQLite…).',
      'Both support prepared statements and are secure when used correctly.',
      'PDO is object-oriented only; MySQLi offers both styles.',
    ],
    scene: 'pdo',
  },
  {
    num: '16',
    id: 'best-practices',
    title: 'Best Practices',
    blurb:
      'Small habits that keep your database fast, safe and easy to maintain.',
    simple:
      'Seatbelts for your code: prepare statements, close connections, and never trust user input.',
    points: [],
    scene: 'best',
  },
  {
    num: '17',
    id: 'viva',
    title: 'Viva Questions',
    blurb:
      'Quick-fire answers for your college viva — revise these and walk in confident.',
    simple: 'Ten questions examiners love, with crisp two-line answers.',
    points: [],
    scene: 'viva',
  },
]
