import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  survey: FormGroup;
  constructor() {}
  ngOnInit() {
    this.survey = new FormGroup({
      surveyName: new FormControl(''),
      logoUrl: new FormControl(''),
      headerUrl: new FormControl(''),
      headerColor: new FormControl(''),
      footerUrl: new FormControl(''),
      footerColor: new FormControl(''),
      sections: new FormArray([this.initSection()]),
    });
    this.setQuestionIndex();
  }

  initSection() {
    return new FormGroup({
      sectionTitle: new FormControl(''),
      sectionDescription: new FormControl(''),
      questions: new FormArray([this.initQuestion()]),
    });
  }
  initQuestion() {
    return new FormGroup({
      questionNo: new FormControl(''),
      questionTitle: new FormControl(''),
      questionType: new FormControl('', Validators.required),
      options: new FormArray([this.initOptions()]),
    });
  }

  initOptions() {
    return new FormGroup({
      optionTitle: new FormControl(''),
    });
  }

  addSection() {
    const control = <FormArray>this.survey.get('sections');
    control.push(this.initSection());

    this.setQuestionIndex();
  }

  addQuestion(j) {
    const sections = <FormArray>this.survey.get('sections');
    const questions = <FormArray>sections.controls[j].get('questions');
    questions.push(this.initQuestion());
    this.setQuestionIndex();
  }

  add(i, j) {
    //console.log(k);
    const sections = <FormArray>this.survey.get('sections');
    const questions = <FormArray>sections.controls[i].get('questions');
    const options = <FormArray>questions.controls[j].get('options');

    // const control = <FormArray>this.survey.get(['sections',0,'questions',k,'options']); // also try this new syntax
    //console.log(control);
    options.push(this.initOptions());
  }

  getSections(form) {
    //console.log(form.get('sections').controls);
    return form.controls.sections.controls;
  }
  getQuestions(form) {
    //console.log(form.controls.questions.controls);
    return form.controls.questions.controls;
  }
  getOptions(form) {
    //console.log(form.get('options').controls);
    return <FormArray>form.controls.options.controls;
  }

  get sections(): FormArray {
    return <FormArray>this.survey.get('sections');
  }

  removeQuestion(j) {
    const control = <FormArray>this.sections.controls[j].get('questions');
    control.removeAt(j);
    this.setQuestionIndex();
  }

  removeSection(i) {
    const control = <FormArray>this.survey.get('sections');
    control.removeAt(i);

    this.setQuestionIndex();
  }

  removeOption(i, j, k) {
    console.log(i, j, k);
    const control = <FormArray>(
      this.survey.get(['sections', i, 'questions', j, 'options'])
    ); // also try this new syntax
    control.removeAt(k);
  }

  remove(i, j) {
    const control = <FormArray>(
      this.survey.get(['sections', i, 'questions', j, 'options'])
    );
    control.removeAt(0);
    control.controls = [];
  }

  onSubmit(form) {}

  setQuestionIndex() {
    let questionIndex = 1;
    this.survey.value.sections.forEach((section, secIndex) => {
      console.log(section);
      console.log(secIndex);
      section.questions.forEach((question, queIndex) => {
        (
          this.sections.controls[secIndex].get('questions') as FormArray
        ).controls[queIndex]
          .get('questionNo')
          .patchValue(questionIndex);

        // ((((this.survey.get('sections') as FormArray).at(
        //   secIndex
        // ) as FormGroup).get('questions') as FormArray).at(
        //   queIndex
        // ) as FormGroup)
        //   .get('questionNo')
        //   .patchValue(questionIndex);

        questionIndex++;
      });
    });
  }
}
