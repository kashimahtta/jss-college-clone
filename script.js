const blocks = [
  {
    id: 1,
    name: "AB1",
    description: "Main block for CSE",
    teachers: [],
    students: [],
  },
  {
    id: 2,
    name: "AB2",
    description: "EE and ECE block",
    teachers: [],
    students: [],
  },
  {
    id: 3,
    name: "AB3",
    description: "Mechanical block",
    teachers: [],
    students: [],
  },
  {
    id: 4,
    name: "AB4",
    description: "University block",
    teachers: [],
    students: [],
  },
  {
    id: 5,
    name: "AB5",
    description: "First year common block",
    teachers: [],
    students: [],
  },
];

const teachers = [
  { id: 101, name: "Ms. Priya", role: "Teacher", blockId: 1 },
  { id: 102, name: "Mr. Ravi", role: "Teacher", blockId: 2 },
  { id: 103, name: "Ms. Neha", role: "Teacher", blockId: 3 },
  { id: 104, name: "Mr. Ashok", role: "Teacher", blockId: 4 },
];

const students = [
  { id: 201, name: "Rahul", role: "Student", blockId: 1 },
  { id: 202, name: "Sana", role: "Student", blockId: 5 },
  { id: 203, name: "Karthik", role: "Student", blockId: 2 },
  { id: 204, name: "Anika", role: "Student", blockId: 3 },
];

const blocksGrid = document.getElementById("blocksGrid");
const teacherList = document.getElementById("teacherList");
const studentList = document.getElementById("studentList");
const disclaimerOverlay = document.getElementById("disclaimerOverlay");
const choiceOverlay = document.getElementById("choiceOverlay");
const findOverlay = document.getElementById("findOverlay");
const addOverlay = document.getElementById("addOverlay");
const continueButton = document.getElementById("continueButton");
const cancelButton = document.getElementById("cancelButton");
const findButton = document.getElementById("findButton");
const addButton = document.getElementById("addButton");
const findRole = document.getElementById("findRole");
const findName = document.getElementById("findName");
const submitFindButton = document.getElementById("submitFindButton");
const backFromFindButton = document.getElementById("backFromFindButton");
const findResult = document.getElementById("findResult");
const addBlockForms = document.getElementById("addBlockForms");
const pageContent = document.querySelector("main");

function render() {
  blocks.forEach((block) => {
    block.teachers = teachers.filter((teacher) => teacher.blockId === block.id);
    block.students = students.filter((student) => student.blockId === block.id);
  });

  blocksGrid.innerHTML = blocks
    .map(
      (block) => `
      <article class="block-card">
        <h3>${block.name}</h3>
        <p>${block.description}</p>
        <strong>Teachers</strong>
        <ul class="person-list">
          ${block.teachers
            .map(
              (teacher) => `
                <li>
                  <span>${teacher.name}</span>
                  <button data-person="teacher" data-id="${teacher.id}">Change</button>
                </li>
              `,
            )
            .join("")}
        </ul>
        <strong>Students</strong>
        <ul class="person-list">
          ${block.students
            .map(
              (student) => `
                <li>
                  <span>${student.name}</span>
                  <button disabled title="Students cannot change block">Locked</button>
                </li>
              `,
            )
            .join("")}
        </ul>
      </article>
    `,
    )
    .join("");

  teacherList.innerHTML = teachers
    .map(
      (teacher) => `
      <li>
        <span class="entity-label">${teacher.name}</span>
        <span class="entity-meta">${getBlockName(teacher.blockId)}</span>
      </li>
    `,
    )
    .join("");

  studentList.innerHTML = students
    .map(
      (student) => `
      <li>
        <span class="entity-label">${student.name}</span>
        <span class="entity-meta">${getBlockName(student.blockId)}</span>
      </li>
    `,
    )
    .join("");
}

function getBlockName(blockId) {
  const block = blocks.find((item) => item.id === blockId);
  return block ? `${block.name}` : "Unassigned";
}

function handleBlockChange(teacherId) {
  const teacher = teachers.find((item) => item.id === teacherId);
  if (!teacher) return;

  const newBlockId = parseInt(
    prompt(
      `Enter new block number for ${teacher.name} (1-5):`,
      teacher.blockId,
    ),
    10,
  );

  if (!newBlockId || newBlockId < 1 || newBlockId > 5) {
    alert("Please enter a valid block number between 1 and 5.");
    return;
  }

  teacher.blockId = newBlockId;
  render();
}

blocksGrid.addEventListener("click", (event) => {
  const button = event.target.closest('button[data-person="teacher"]');
  if (!button) return;

  const teacherId = parseInt(button.dataset.id, 10);
  handleBlockChange(teacherId);
});

continueButton.addEventListener("click", () => {
  disclaimerOverlay.classList.add("hidden");
  choiceOverlay.classList.remove("hidden");
});

findButton.addEventListener("click", () => {
  choiceOverlay.classList.add("hidden");
  findOverlay.classList.remove("hidden");
  findResult.textContent = "";
  findName.value = "";
});

addButton.addEventListener("click", () => {
  choiceOverlay.classList.add("hidden");
  addOverlay.classList.remove("hidden");
  renderAddForms();
});

submitFindButton.addEventListener("click", () => {
  const role = findRole.value;
  const name = findName.value.trim().toLowerCase();

  if (!role) {
    alert("Please select Teacher or Student before searching.");
    return;
  }

  if (!name) {
    alert("Please enter the name to search.");
    return;
  }

  const list = role === "Teacher" ? teachers : students;
  const match = list.find((item) => item.name.toLowerCase().includes(name));

  if (match) {
    const location = getBlockName(match.blockId);
    const description =
      blocks.find((block) => block.id === match.blockId)?.description || "";
    findResult.textContent = `${match.name} is located in ${location}${description ? ` (${description})` : ""}.`;
  } else {
    findResult.textContent = `No ${role.toLowerCase()} found with that name.`;
  }
});

backFromFindButton.addEventListener("click", () => {
  findOverlay.classList.add("hidden");
  choiceOverlay.classList.remove("hidden");
});

backToChoiceButton.addEventListener("click", () => {
  addOverlay.classList.add("hidden");
  choiceOverlay.classList.remove("hidden");
});

addBlockForms.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action='save-block']");
  if (!button) return;

  const blockId = parseInt(button.dataset.blockId, 10);
  const formCard = button.closest(".block-add-card");
  const role = formCard.querySelector("select").value;
  const name = formCard.querySelector("input").value.trim();
  const details = formCard.querySelector("textarea").value.trim();

  if (!name) {
    alert("Please enter a name before saving.");
    return;
  }

  if (role === "Teacher") {
    const nextId = Math.max(0, ...teachers.map((t) => t.id)) + 1;
    teachers.push({ id: nextId, name, role, blockId, details });
  } else {
    const nextId = Math.max(0, ...students.map((s) => s.id)) + 1;
    students.push({ id: nextId, name, role, blockId, details });
  }

  formCard.querySelector("input").value = "";
  formCard.querySelector("textarea").value = "";
  render();
  alert(`${role} added to ${getBlockName(blockId)}.`);
});

cancelButton.addEventListener("click", () => {
  disclaimerOverlay.innerHTML = `
    <div class="disclaimer-card">
      <h2>Closed</h2>
      <p>The project has been closed. To see the project, please press Continue.</p>
    </div>
  `;
  pageContent.classList.add("hidden");
});

function renderAddForms() {
  addBlockForms.innerHTML = blocks
    .map(
      (block) => `
        <article class="block-add-card">
          <h3>${block.name}</h3>
          <p>${block.description}</p>
          <label>
            Role
            <select>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </label>
          <label>
            Name
            <input type="text" placeholder="Enter name" />
          </label>
          <label>
            Building details
            <textarea placeholder="Optional building or room info"></textarea>
          </label>
          <button data-action="save-block" data-block-id="${block.id}">Save to ${block.name}</button>
        </article>
      `,
    )
    .join("");
}

render();
