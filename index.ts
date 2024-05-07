#!  /usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';

interface Course {
  id: number;
  name: string;
  creditHours: number;
  fee: number;
}

interface Student {
  id: string;
  name: string;
  courses: Course[];
  balance: number;
}


class StudentManagementSystem {
  private students: Student[] = [];
  private courses: Course[] = [];

  constructor() {
    // Initialize courses
    this.courses = [
      { id: 1, name: 'Typescript', creditHours: 5, fee: 500 },
     { id: 2, name: 'Javascript', creditHours: 4, fee: 400 },
      { id: 3, name: 'Artificial Intelligence', creditHours: 3, fee: 300 },
      { id: 4, name: 'Software Development', creditHours: 5, fee: 500 },
      { id: 5, name: 'Internet of Things', creditHours: 5, fee: 500}
    ];
  }
     // Method to get students
  getStudents(): Student[] {
    return this.students;
  }

  // Method to get courses
  getCourses(): Course[] {
    return this.courses;
  }
  
  // Generate a 5-digit unique student ID
  private generateStudentId(): string {
    let id = '';
    while (id.length < 5) {
      id += Math.floor(Math.random() * 10);
    }
    return id;
  }
  
  // Add a new student
  addStudent(name: string): void {
    const id = this.generateStudentId();
    const student: Student = {
      id,
      name,
      courses: [],
      balance: 0
    };
    this.students.push(student);
    console.log(`\nStudent ${name} added with ID: ${id}`);
  }
  
// Enroll a student in a course
enrollStudent(studentId: string, courseId: number): void {
  const student = this.students.find(s => s.id === studentId);
  const course = this.courses.find(c => c.id === courseId);
  if (student && course) {
    student.courses.push(course);
    student.balance += course.fee;
    console.log(`\nStudent ${student.name} enrolled in ${course.name}.`);
  } else {
    console.log('Student or course not found.');
  }
}

// Pay tuition fees
payTuition(studentId: string, amount: number): void {
  const student = this.students.find(s => s.id === studentId); // Change 'name' to 'id'
  if (student) {
    if (amount <= student.balance) {
      student.balance -= amount;
      console.log(`\nStudent ${studentId} paid Rs.${amount} and his remaining due amount for course is: Rs.${student.balance}`);
    } else {
      console.log('Thank you, all due payment is paid, please visit cashier to collect remaining amount.');
    }
  } else {
    console.log('Student not found.');
  }
}

  // In the viewBalance function
viewBalance(studentId: string): void {
  console.log("Searching for student with ID:", studentId); // Logging the ID being searched for
  const student = this.students.find(s => s.id === studentId); // Change 'name' to 'id'
  if (student) {
    console.log(`\nStudent ${studentId}: his remaining balance for course fee is to pay Rs.${student.balance}`);
  } else {
    console.log('Student not found.');
  }
}
  
// In the showStatus function
showStatus(studentId: string): void {
  console.log("Searching for student with ID:", studentId); // Logging the ID being searched for
  const student = this.students.find(s => s.id === studentId); // Change 'name' to 'id'
  if (student) {
    console.log(`\nStudent ID: ${student.id}`);
    console.log(`Name: ${student.name}`);
    // console.log('Courses Enrolled:'); // Uncomment if needed
    student.courses.forEach(course => {
      console.log(`Courses Enrolled: ${course.name}`);
      console.log(`Balance: Rs.${student.balance}`);
    });
    // console.log(`\nBalance: Rs.${student.balance}`);
  } else {
    console.log('Student not found.');
  }
}

}

const sms = new StudentManagementSystem();

 // In the addStudent function
function addStudent() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter student name:',
      validate: function(input) {
          //check if the input contains only alphabetical characters
        if (/^[A-Za-z]+$/.test(input)) {
          return true;
        } else {
          return 'Please enter only alphabetical characters, press delete to exit and re-enter student name.';
        }
      }
    }
  ]).then(answers => {
    sms.addStudent(answers.name);
    mainMenu();
  });
}
function enrollStudent() {
  const students = sms.getStudents();
  const courses = sms.getCourses();
  if (students.length === 0 || courses.length === 0) {
    console.log('No students or courses found.');
    mainMenu();
    return;
  } 

  inquirer.prompt([
    {
      type: 'list',
      name: 'studentId',
      message: 'Select student:',
      choices: students.map(student => ({ name: student.name, value: student.id }))
    },
    {
      type: 'list',
      name: 'courseId',
      message: 'Select course:',
      choices: courses.map(course => ({ name: course.name, value: course.id }))
    },
  ]).then(answers => {
    sms.enrollStudent(answers.studentId, answers.courseId);
    mainMenu();
  });
}

// In the second function (assuming it's a standalone function)
function payTuition(): void {
  inquirer.prompt([
    {
      type: 'input',
      name: 'studentId',
      message: 'Enter student ID:',
      validate: function(input) {
        // Check if the input contains only numerical digits
        if (/^\d+$/.test(input)) {
          return true;
        } else {
          return 'Please enter only numerical digits for the student ID.';
        }
      }
    },
    {
      type: 'input',
      name: 'amount',
      message: 'Enter amount to pay:',
      validate: function(input) {
        // Check if the input contains only numerical digits
        if (/^\d+$/.test(input)) {
          return true;
        } else {
          return 'Please enter only numerical digits for the amount.';
        }
      }
    }
  ]).then(answers => {
    // Logging to see if the answers are captured correctly
    //console.log("Answers:", answers);
    const students = sms.getStudents();
    //console.log("Students:", students); // Logging students to see if they're fetched correctly
    const student = students.find(student => student.id === answers.studentId);
    //console.log("Found Student:", student); // Logging the found student
    if (student) {
      sms.payTuition(answers.studentId, parseFloat(answers.amount));
    } else {
      console.log('Student not found.');
    }
    mainMenu();
  });
}

// In the standalone function
function viewBalance() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'studentId',
      message: 'Enter student ID:',
      validate: function(input) {
        // Check if the input contains only numerical digits
        if (/^\d+$/.test(input)) {
          return true;
        } else {
          return 'Please enter only numerical digits for the amount.';
        }
      }
    }
  ]).then(answers => {
    //console.log("Entered Student ID:", answers.studentId); // Logging the entered student ID
    const students = sms.getStudents();
    //console.log("Students:", students); // Logging students to see if they're fetched correctly
    const student = students.find(student => student.id === answers.studentId);
    //console.log("Found Student:", student); // Logging the found student
    if (student) {
      sms.viewBalance(answers.studentId);
    } else {
      console.log('Student not found.');
    }
    mainMenu();
  });
}

// In the standalone function
function showStatus() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'studentId',
      message: 'Enter student ID:',
      validate: function(input) {
        // Check if the input contains only numerical digits
        if (/^\d+$/.test(input)) {
          return true;
        } else {
          return 'Please enter only numerical digits for the amount.';
        }
      }
    }
  ]).then(answers => {
    //console.log("Entered Student ID:", answers.studentId); // Logging the entered student ID
    const students = sms.getStudents();
    //console.log("Students:", students); // Logging students to see if they're fetched correctly
    const student = students.find(student => student.id === answers.studentId);
    //console.log("Found Student:", student); // Logging the found student
    if (student) {
      sms.showStatus(answers.studentId);
    } else {
      console.log('Student not found.');
    }
    mainMenu();
  });
}
console.log(chalk.italic.underline.yellow("\n\tWELCOME TO ALEEZE STUDENT MANAGEMENT SYSTEM......!"))
// Other functions for different actions (viewBalance, payTuition, showStatus) similarly...

function mainMenu() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: (chalk.green('Select an Operations')),
      choices: [
        'Add Student',
        'Enroll Student',
        'Pay Tuition',
        'View Balance',
        'Show Status',
        'Exit'
      ]
    }
  ]).then(answers => {
    switch (answers.action) {
      case 'Add Student':
        addStudent();
        break;
      case 'Enroll Student':
        enrollStudent();
        break;
        case 'View Balance':
        viewBalance();
        break;
        case 'Pay Tuition':
        payTuition();
        break;
        case 'Show Status':
        showStatus();
        break;
        
      // Add cases for other actions
      case 'Exit':
        console.log(chalk.bold.italic.underline.magenta('\n\t ....................EXITING........................'));
        break;
      default:
        console.log('Invalid choice.');
        mainMenu();
    }
  });
}

// Start the CLI by calling the mainMenu function
mainMenu();

