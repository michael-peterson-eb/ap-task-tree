/**
 * REQUIRED VARIABLE
 *
 * This is defined from the object page.
 * ASSESSMENT_QUESTION_CONDITION
 *
 * Example:
 * var ASSESSMENT_QUESTION_CONDITION = `EA_SA_rsProcess IN ({!id})`
 * EA_SA_rsProcess = Integration name of Process lookup related to EA_SA_AssessmentQuestion
 *
 * -----------------------------------------------------------------------------------------------------------
 *
 * REMINDER:
 *
 * Don't use this:
 * If the object is not related to Assessment Question object
 *
 * Created By: Ivan
 */

var ImpactAssessmentV2 = (() => {
  let __pageType;

  let __assessment_question_types = new Map();
  let __assessment_questions = new Map();
  let __assessment_question_templates = new Map();

  let __question_template_responses = new Map();
  let __question_interval_responses = new Map();
  let __interval_questions = new Map();
  let __response_options = new Map();

  let __question_type_panels = new Map();
  let __statusJSONDefault = {};
  let __hasUpdate = false;
  let __steps = [];
  let $__wizard;

  const init = async () => {
    _UI.loader.start();
    _FN.clearMapStores();

    // Get the current page type [view, edit, new, selector]
    __pageType = utils.page.type();

    /**
     * This _FN is like a controller that request following data
     * - Getting the Assement question types
     * - Getting the Assessment question templates (Field Type,Questions)
     * - Getting the Assessment question (Response,Answers)
     * - Getting the Assessment response options
     */
    await _FN.pages[__pageType]();

    /**
     * This _UI render the following UI's
     * - Wizard multi form
     *     -- Assessment Question types as Steps
     * - Form Elements
     * - Dropdown Panel element
     *     -- Assessment Question template as Questions
     *     -- Assessment Question as response/answers
     */
    await _UI.pages[__pageType]();

    /**
     * - Initialize the kendo fields and Panels
     * - Set kendo Field default values
     * - Bind kendo event method
     */
    await _BIND.pages[__pageType]();

    //_UI.loader.end();
  };

  const _FORM = {
    render: async (formConfig) => {
      let fields = new Map();

      if (formConfig?.items.length > 0) {
        const items = formConfig?.items;

        for (let item of items) {
          const key = item?.field || "default-name";
          const elem = item?.form_object || "input";

          // Convert Item to HTML format needed for wizard content
          const fieldHTML = await _FORM.fields(item, elem, formConfig.id);

          fields.set(key, fieldHTML);
        }
      }

      return fields;
    },

    fields: async (fieldConfig, fieldType, typeID) => {
      let required = fieldConfig?.validation?.required ? "required" : "";
      let requiredMsg = fieldConfig?.validation?.required
        ? `data-required-msg="This question must be specified"`
        : "";
      let type = fieldConfig?.type != "" ? fieldConfig?.type : "text";
      let order = fieldConfig?.order;
      let templateID = fieldConfig?.id;
      let questionID = fieldConfig?.question_id;
      let integrationName = fieldConfig?.question_field_integration_name;
      let isTimeInterval = fieldConfig?.is_time_interval;
      let id = fieldConfig?.field;
      let name = fieldConfig?.field;
      let label = fieldConfig?.label;
      let className = fieldConfig?.class;
      let textHTML;

      __question_template_responses.set(templateID, {
        questionID,
        field: integrationName,
        value:
          integrationName == "EA_SA_ddResponse"
            ? moment(fieldConfig?.value).format("YYYY-MM-DD")
            : fieldConfig?.value,
      });

      if (isTimeInterval) {
        // Time Interval Table
        textHTML = _UI.renderTimeIntervalTableEditable(
          templateID,
          label,
          order,
          required,
          typeID
        );
      } else {
        // For Fields
        switch (fieldType) {
          case "input":
            textHTML = `
                            <section class="wizard-section">
                                <label class="${required}">${order}. ${label}</label>
                                <textarea class="type-input ${className}" id="${id}" name="${name}" ${required} ${requiredMsg} data-template-id="${templateID}" data-question-id="${questionID}" data-int-name="${integrationName}" data-type-id="${typeID}"></textarea>
                            </section>
                        `;
            break;

          case "currency":
            textHTML = `
                            <section class="wizard-section">
                                <label class="${required}">${order}. ${label}</label>
                                <input class="type-currency ${className}" id="${id}" name="${name}" ${required} ${requiredMsg} data-template-id="${templateID}" data-question-id="${questionID}" data-int-name="${integrationName}" data-type-id="${typeID}"/>
                            </section>
                        `;
            break;

          case "date":
            textHTML = `
                            <section class="wizard-section">
                                <label class="${required}">${order}. ${label}</label>
                                <input class="type-date ${className}" id="${id}" name="${name}" ${required} ${requiredMsg} data-template-id="${templateID}" data-question-id="${questionID}" data-int-name="${integrationName}" data-type-id="${typeID}"/>
                            </section>
                        `;
            break;

          case "multi-select":
            textHTML = `
                            <section class="wizard-section">
                                <label class="${required}">${order}. ${label}</label>
                                <select class="multi-select ${className}" id="${id}" name="${name}" multiple="multiple" ${required} ${requiredMsg} data-template-id="${templateID}" data-question-id="${questionID}" data-int-name="${integrationName}" data-type-id="${typeID}"></select>
                            </section>
                        `;
            break;

          case "single-select":
            textHTML = `
                            <section class="wizard-section">
                                <label class="${required}">${order}. ${label}</label>
                                <input class="single-select ${className}" id="${id}" name="${name}" ${required} ${requiredMsg} data-template-id="${templateID}" data-question-id="${questionID}" data-int-name="${integrationName}" data-type-id="${typeID}"/>
                            </section>
                        `;
            break;

          default:
            break;
        }
      }

      return textHTML;
    },
  };

  const _UI = {
    pages: {
      new: () => {},
      view: async () => {
        await _UI.renderWizard();
        console.log("UI Completed...");
        return;
      },
      edit: () => {},
      selector: async () => {
        await _UI.renderWizard();
        console.log("UI Completed...");
        return;
      },
      record_list: () => {},
    },
    loader: {
      start: () => {
        kendo.ui.progress($(`.multi-form`), true);
      },
      end: () => {
        kendo.ui.progress($(`.multi-form`), false);
      },
    },
    toggleApplicationImpactAssesmentTab: () => {
      const isAggregateFromProcesses =
        settings.rbApplicationRTOCalculationMethodology == "PROC";
      if (isAggregateFromProcesses) {
        console.log("utils.tabs.toggle('Impact Assessment', false) ");
        utils.tabs.toggle("Impact Assessment", false);
      }
    },
    renderWizard: async () => {
      if (__steps.length > 0) {
        try {
          IBMultiForm.config("impacts", {
            tabs: __steps.sort((a, b) => {
              return a.id - b.id;
            }),
            contents: __steps.sort((a, b) => {
              return a.id - b.id;
            }),
            next: _BIND.handleWizardSteps,
            prev: _BIND.handleWizardSteps,
          });

          // $__wizard = $("#wizard").kendoWizard({
          //     steps:__steps.sort((a, b) => {return a.id - b.id;}),
          //     select: _BIND.handleWizardSteps,
          //     done: _BIND.handleWizardDone
          // }).data("kendoWizard");
        } catch (error) {
          location.reload();
        }
      } else {
        $("#wizard").html(`
                    <section class="no-record-found">No Records Found</section>
                `);
      }

      return;
    },

    kendoPanel: (id) => {
      return `<ul id="panel-${id}" class="type-panelbar" data-type-id="${id}"></ul>`;
    },

    wizardSteps: function (e) {
      const typeID = __steps[e.index]["className"]; // e.g type-123456
      const status = __statusJSONDefault[typeID];
      const isCompleted = status == "completed";
      const isInprogress = status == "in-progress";

      if (isCompleted) {
        return `<span class="k-step-indicator-icon k-icon k-i-check progress-completed"></span>`;
      } else if (isInprogress) {
        return `<i class="fa fa-ellipsis-h progress-in-progress" aria-hidden="true"></i>`;
      } else {
        return `<span class="k-step-indicator-icon k-icon k-i-x progress-pending"></span>`;
      }
    },

    stepIcons: function (type) {
      const typeID = type; // e.g type-123456
      const status = __statusJSONDefault[typeID];
      const isCompleted = status == "completed";
      const isInprogress = status == "in-progress";

      if (isCompleted) {
        return `<span class="k-step-indicator-icon k-icon k-i-check EA_SA_labelComplete"></span>`;
      } else if (isInprogress) {
        return `<i class="fa fa-ellipsis-h EA_SA_labelWaiting" aria-hidden="true"></i>`;
      } else {
        return `<span class="k-step-indicator-icon k-icon k-i-x EA_SA_label"></span>`;
      }
    },

    footerSection: (id) => {
      return `
                <section class="footer-section">
                    <div class="notes">
                        <p><span class="k-icon k-i-warning"></span> Please check this box to update the progress bar once you have completed this section.</p>
                    </div>
                    <div class="confimation-checkbox">
                        <input type="checkbox" class="type-checkbox" name="cb_${id}" id="footer-${id}" data-type-id="${id}"/>
                        <p>This section of the Impact Assessment is completed</p>
                    </div>
                </section>
            `;
    },

    renderTimeIntervalTable: (templateID) => {
      const intervalQuestions = __interval_questions.get(templateID);
      let timeIntervalRow = `
                <section class="wizard-section">
                    <table id="table-${templateID}" class="time-interval-table">
                    <thead>
                            <th>Time Interval</th>
                            <th>Impact</th>
                    </thead>
            `;

      if (intervalQuestions.length > 0) {
        for (let question of intervalQuestions) {
          const timeIntervalName = question?.EA_SA_rfTimeInterval;
          const templateID = question?.EA_SA_rsAssessmentQuestionTemplate;
          const responseOptionID = question?.EA_SA_rsAssessmentResponseOptions;
          const responseOption = __response_options
            .get(templateID)
            .filter((item) => item.id == responseOptionID);

          timeIntervalRow += `
                        <tr>
                            <td>${timeIntervalName}</td>
                            <td>
                                ${
                                  responseOption.length > 0
                                    ? responseOption[0]?.name
                                    : "-- Please Select --"
                                }
                            </td>
                        </tr>
                    `;
        }
        timeIntervalRow += `</table> </section>`;
      } else {
        timeIntervalRow += `
                    <tr>
                        <td colspan="2">No questions generated.</td>
                    </tr>
                `;
      }

      return timeIntervalRow;
    },

    renderTimeIntervalTableEditable: (
      templateID,
      label,
      order,
      required,
      typeID
    ) => {
      const intervalQuestions = __interval_questions.get(templateID);
      let timeIntervalRow = `<section class="wizard-section">
                <label class="${required}">${order}. ${label}</label>
                <table id="table-${templateID}" class="time-interval-table">
                <thead>
                        <th>Time Interval</th>
                        <th>Impact</th>
                </thead>
            `;

      if (intervalQuestions.length > 0) {
        for (let question of intervalQuestions) {
          const timeIntervalName = question?.EA_SA_rfTimeInterval;
          const templateID = question?.EA_SA_rsAssessmentQuestionTemplate;
          const questionID = question?.id;

          __question_interval_responses.set(questionID, {
            field: "EA_SA_rsAssessmentResponseOptions",
            value: question?.EA_SA_rsAssessmentResponseOptions,
          });

          timeIntervalRow += `
                        <tr>
                            <td>${timeIntervalName}</td>
                            <td>
                                <input id="question-${questionID}" data-template-id="${templateID}" data-question-id="${questionID}" data-type-id="${typeID}" class="response-list"/>
                            </td>
                        </tr>
                    `;
        }
      } else {
        timeIntervalRow += `
                    <tr>
                        <td colspan="2">No questions generated.</td>
                    </tr>
                `;
      }

      timeIntervalRow += `</table> </section>`;

      return timeIntervalRow;
    },

    displayFormFields: async (typeId, items) => {
      // HTML Fields
      const templatesFieldHTML = await _FORM.render(items);

      // Add fields into the form
      templatesFieldHTML.forEach((value) => {
        $(`form#type-${typeId} .footer-section`).before(value);
      });

      return;
    },

    displayPanels: (typeId, questionsTemplatesItem) => {
      const sectionHasContent = $(`#panel-${typeId}.type-panelbar`).html();
      if (sectionHasContent == "") {
        const panelList = questionsTemplatesItem.map((item) => {
          const isTimeInterval = item.is_time_interval;
          const templateID = item.id;
          const templateType = item.type;
          let panelContent = { text: "No answer." };

          if (isTimeInterval) {
            panelContent = {
              text: _UI.renderTimeIntervalTable(templateID),
              encoded: false,
            };
          } else if (item.value) {
            if (templateType == "select") {
              const responseID = item?.value;
              const responseOptions = __response_options
                .get(templateID)
                .filter((item) => item.id == responseID);
              panelContent.text =
                responseOptions.length > 0
                  ? responseOptions[0]?.name
                  : "-- Please Select --";
            } else if (templateType == "multi-select") {
              const responseID = item?.value;
              let responseOptions = __response_options
                .get(templateID)
                .filter((item) => responseID.indexOf(item.id) > -1);

              responseOptions = responseOptions.map((item) => {
                return item.name;
              });
              panelContent.text =
                responseOptions.length > 0
                  ? responseOptions.join(", ")
                  : "-- Please Select --";
            } else {
              panelContent.text = item.value != "null" ? item.value : " ";
            }
          }

          // QUESTION FORMAT:
          // “<* (If the question is required)><Display Order>. <Question>”
          const questionLabel = `${item.order}. ${item.label}`;

          return {
            text: `<span ${
              item.validation.required ? `class="required"` : ``
            }>${questionLabel}</span>`,
            encoded: false,
            items: [panelContent],
          };
        });

        // Store Panel by Question Type
        __question_type_panels.set(typeId, panelList);

        // BIND
        _BIND.bindPanel(typeId);
      }
    },

    displaydefault: async () => {
      const firstTypeID = __assessment_question_types.entries().next().value;
      if (firstTypeID && firstTypeID.length > 0) {
        await _FN.handleSectionQuestions(firstTypeID[0]);
        _BIND.bindInputs(firstTypeID[0]);
      }
    },
  };

  const _BIND = {
    pages: {
      new: async () => {},
      view: async () => {
        await _BIND.bindPanel();
        _UI.displaydefault();
        console.log("BIND Completed...");
        return;
      },
      edit: async () => {},
      selector: async () => {
        await _BIND.bindCheckBox();
        _BIND.onPageSubmit();
        _BIND.optimizeMultiSelect();
        _UI.displaydefault();
        console.log("BIND Completed...");
        return;
      },
      record_list: async () => {},
    },

    bindDependencyScript: (urls) => {
      if (Array.isArray(urls)) {
        for (let url of urls) {
          const tag = document.createElement("script");
          tag.src = url;
          document.getElementsByTagName("head")[0].prepend(tag);
          $.getScript(url);
        }
      } else {
        const tag = document.createElement("script");
        tag.src = urls;
        document.getElementsByTagName("head")[0].prepend(tag);
      }
    },

    bindInputs: async (typeId) => {
      await _BIND.bindMultiSelect(typeId);
      await _BIND.bindSingleSelect(typeId);
      await _BIND.bindCurrency(typeId);
      await _BIND.bindDate(typeId);
      await _BIND.bindInput(typeId);
      await _BIND.bindFormValidator(typeId);
      await _BIND.bindResponseSelect(typeId);
      return;
    },

    // Handle Done
    handleWizardDone: function (e) {
      const button = e.button;

      let currentStep = $__wizard.activeStep();
      let typeId = currentStep.options.className;

      if (__pageType == "selector") {
        const validatable = $(`#${typeId}`)
          .kendoValidator()
          .data("kendoValidator");
        if (validatable.validate()) {
          // if(__hasUpdate){
          //     _FN.updateQuestions()
          // }
        } else {
          rbf_growlWarning("Please fill out the required fields.");
          e.preventDefault();
        }
      }
    },

    onPageSubmit: () => {
      $('a[form="theForm"]').on("click", async () => {
        if (__hasUpdate) {
          return await _FN.updateQuestions();
        } else {
          return true;
        }
      });
    },

    // Handle Steps Next/Nav
    handleWizardSteps: async function (e) {
      const currentStep = IBMultiForm.activeData();
      let typeId = currentStep.className;

      console.log("eeeeeee --- ", e);
      let selectedTypeID = currentStep.id;

      // LOAD DATA
      await _FN.handleSectionQuestions(selectedTypeID);

      if (__pageType == "selector") {
        const validatable = $(`#${typeId}`)
          .kendoValidator()
          .data("kendoValidator");
        if (validatable.validate()) {
          if (__hasUpdate) {
            _FN.updateQuestions();
          }
        } else {
          rbf_growlWarning("Please fill out the required fields.");
          e.preventDefault();
        }
      }

      _BIND.bindInputs(selectedTypeID);
    },

    // Handle Form Fields
    handleFormFields: function () {
      const value = this.value();
      const id = this.element.context.id;
      const templateID = $(this.element).data("template-id");
      const questionID = $(this.element).data("question-id");
      const typeID = $(this.element).data("type-id");
      const isRequired = $(this.element).attr("required");

      let fieldValue = value;

      // Store field value
      const template_response = __question_template_responses.get(templateID);

      // Format Value

      // Dates
      if (template_response.field == "EA_SA_ddResponse") {
        fieldValue = moment(value).format("YYYY-MM-DD");
      }
      // Related IDs
      if (template_response.field == "EA_SA_rsAssessmentResponseOptions") {
        fieldValue = Array.isArray(value) ? value.join("|") : value;
      }

      __question_template_responses.set(templateID, {
        ...template_response,
        value: fieldValue,
      });

      // This should only uncheck if a required question is left unanswered
      if (isRequired === "required") {
        if (value === "" || !value) {
          _BIND.resetCheckboxFooter(typeID);
        }

        if (Array.isArray(value)) {
          if (value.length === 0) {
            _BIND.resetCheckboxFooter(typeID);
          }
        }
      }
      __hasUpdate = true;
    },

    // Handle Table Fields
    handleTableFields: function () {
      const value = this.value();
      const id = this.element.context.id;
      const templateID = $(this.element).data("template-id");
      const typeID = $(this.element).data("type-id");
      const questionID = $(this.element).data("question-id");
      let fieldValue = value;

      // Store field value
      const question_response = __question_interval_responses.get(questionID);

      __question_interval_responses.set(questionID, {
        ...question_response,
        value: fieldValue,
      });

      _BIND.resetCheckboxFooter(typeID);

      __hasUpdate = true;
    },

    // Handle Footer Checkbox
    handleFootercheckbox: async function (e) {
      const value = this.value();
      const id = this.element.context.id;
      const dataID = $(`#${id}`).data("type-id");

      __statusJSONDefault[`type-${dataID}`] = value
        ? "completed"
        : "in-progress";
      const validatable = $(`#type-${dataID}`)
        .kendoValidator()
        .data("kendoValidator");

      if (validatable.validate()) {
        await _DATA.updateStatusJSON(__statusJSONDefault);
        rbf_growlSuccess("Successfully Updated");
      } else {
        rbf_growlWarning("Please fill out the required fields.");
        e.preventDefault();
        var checkboxInstance = $(`#footer-${dataID}`)
          .kendoCheckBox()
          .data("kendoCheckBox");
        checkboxInstance.check(false);
      }
    },

    // Reset Checkbox Footer
    resetCheckboxFooter: (typeID) => {
      if (typeID) {
        var checkboxInstance = $(`#footer-${typeID}`)
          .kendoCheckBox()
          .data("kendoCheckBox");
        if (checkboxInstance.value()) {
          $(`#footer-${typeID}`).click();
        }
      }
    },

    // Kendo Checkbox
    bindCheckBox: () => {
      // Get Checkboxes
      const checkboxElements = $(".type-checkbox");

      if (checkboxElements.length > 0) {
        for (let checkboxElem of checkboxElements) {
          // Get Checkbox ID
          const checkboxID = $(checkboxElem).attr("id");
          const typeID = $(checkboxElem).data("type-id");

          // Initialized Kendo
          $(`#${checkboxID}`).kendoCheckBox({
            change: _BIND.handleFootercheckbox,
            checked: __statusJSONDefault[`type-${typeID}`] == "completed",
          });
        }
      }

      return;
    },

    // Kendo Form Validator
    bindFormValidator: async (typeId) => {
      // Get Form
      const formElements = $(`#type-${typeId} .type-form`);

      if (formElements.length > 0) {
        for (let formElem of formElements) {
          // Get Form ID
          const formID = $(formElem).attr("id");

          // Initialized Kendo
          $(`#${formID}`).kendoValidator();
        }
      }

      return;
    },

    // Kendo Panel
    bindPanel: (typeId) => {
      // Get Panels
      const panelElements = $(`#panel-${typeId}.type-panelbar`);

      if (panelElements.length > 0) {
        for (let panelElem of panelElements) {
          // Get Panel ID
          const questionTypeId = $(panelElem).data("type-id");
          const panelID = $(panelElem).attr("id");

          // Initialized Kendo
          $(`#${panelID}`)
            .kendoPanelBar({
              dataSource: {
                data: __question_type_panels.get(questionTypeId),
              },
            })
            .data("kendoPanelBar")

            // EXPAND EACH QUESTIONS BY DEFAULT
            .expand($(`#${panelID} li`));
        }
      }

      return;
    },

    // Kendo Textbox
    bindInput: (typeId) => {
      // Get input Fields
      const inputElements = $(`#type-${typeId} .type-input`);

      if (inputElements.length > 0) {
        for (let inputElem of inputElements) {
          // Get Input ID
          const inputID = $(inputElem).attr("id");
          const templateID = $(inputElem).data("template-id");
          const isRequired = $(inputElem).data("required");

          const val = __question_template_responses.get(templateID).value;

          // Initialized Kendo
          $(`#${inputID}`).kendoTextArea({
            rows: 3,
            resizable: "vertical",
            value: val != "null" ? val : "",
            required: isRequired,
            change: _BIND.handleFormFields,
          });
        }
      }

      return;
    },

    // Kendo Numeric Textbox
    bindCurrency: (typeId) => {
      // Get Currency Fields
      const currencyElements = $(`#type-${typeId} .type-currency`);

      if (currencyElements.length > 0) {
        for (let currencyElem of currencyElements) {
          // Get Currency ID
          const currencyID = $(currencyElem).attr("id");
          const templateID = $(currencyElem).data("template-id");
          const isRequired = $(currencyElem).data("required");

          // Initialized Kendo
          $(`#${currencyID}`).kendoNumericTextBox({
            format: "c2",
            value: __question_template_responses.get(templateID).value,
            required: isRequired,
            change: _BIND.handleFormFields,
          });
        }
      }

      return;
    },

    // Kendo Date Picker
    bindDate: (typeId) => {
      // Get Date Fields
      const dateElements = $(`#type-${typeId} .type-date`);

      if (dateElements.length > 0) {
        for (let dateElem of dateElements) {
          // Get Date ID
          const dateID = $(dateElem).attr("id");
          const templateID = $(dateElem).data("template-id");

          // Initialized Kendo
          $(`#${dateID}`).kendoDatePicker({
            value: __question_template_responses.get(templateID).value,
            change: _BIND.handleFormFields,
          });
        }
      }

      return;
    },

    // Kendo Multi select
    bindMultiSelect: async (typeId) => {
      // Get Multi Select
      const multiSelectElements = $(`#type-${typeId} .multi-select`);

      if (multiSelectElements.length > 0) {
        for (let multiElem of multiSelectElements) {
          // Get Multi Select ID
          const multiSelectID = $(multiElem).attr("id");
          const templateID = $(multiElem).data("template-id");

          // Initialized Kendo
          $(`#${multiSelectID}`).kendoMultiSelect({
            dataSource: __response_options.get(templateID),
            value: __question_template_responses.get(templateID).value,
            dataTextField: "name",
            dataValueField: "id",
            placeholder: "--- Please Select ---",
            change: _BIND.handleFormFields,
          });
        }
      }

      return;
    },

    // Kendo Drop-Down List
    bindSingleSelect: async (typeId) => {
      // Get Single Select
      const singleSelectElements = $(`#type-${typeId} .single-select`);

      if (singleSelectElements.length > 0) {
        for (let singleElem of singleSelectElements) {
          // Get Single Select ID
          const sinlgeSelectID = $(singleElem).attr("id");
          const templateID = $(singleElem).data("template-id");

          // Initialized Kendo
          $(`#${sinlgeSelectID}`).kendoDropDownList({
            dataSource: __response_options.get(templateID),
            dataTextField: "name",
            dataValueField: "id",
            optionLabel: {
              name: "--- Please Select ---",
              id: "",
            },
            change: _BIND.handleFormFields,
          });
        }
      }

      return;
    },

    // Kendo Drop-Down List
    bindResponseSelect: async (typeId) => {
      // Get Single Select
      const responseListElements = $(`#type-${typeId} .response-list`);

      if (responseListElements.length > 0) {
        for (let responseElem of responseListElements) {
          // Get Single Select ID
          const responseID = $(responseElem).attr("id");
          const questionID = $(responseElem).data("question-id");
          const templateID = $(responseElem).data("template-id");
          // Initialized Kendo
          $(`#${responseID}`).kendoDropDownList({
            value: __question_interval_responses.get(questionID)?.value,
            dataSource: __response_options.get(templateID),
            dataTextField: "name",
            dataValueField: "id",
            optionLabel: {
              name: "--- Please Select ---",
              id: "",
            },
            change: _BIND.handleTableFields,
          });
        }
      }

      return;
    },

    optimizeMultiSelect: () => {
      var toggle = false;
      $(document).on("click", ".k-state-border-down", function (e) {
        const id = $(e.currentTarget)
          .children("select.multi-select")
          .attr("id");
        if (id) {
          if (toggle) {
            var multiselect = $(`#${id}`).data("kendoMultiSelect");
            multiselect.close();
            toggle = false;
          } else {
            toggle = true;
          }
        }
      });
    },
  };

  const _FN = {
    pages: {
      new: async () => {},
      view: async () => {
        await _FN.getImpactAssessment();
        await _FN.setAssessmentTemplateView();
        console.log("FN Completed...");
        return;
      },
      edit: async () => {},
      selector: async () => {
        await _FN.getImpactAssessment();
        const resp = await _FN.setAssessmentTemplateFields();
        console.log("FN Completed...");

        return resp;
      },
      record_list: async () => {},
    },
    clearMapStores: () => {
      __assessment_question_types.clear();
      __assessment_questions.clear();
      __assessment_question_templates.clear();
      __question_template_responses.clear();
      __question_interval_responses.clear();
      __interval_questions.clear();
      __response_options.clear();
      __question_type_panels.clear();
    },

    formatAssessmentQuestionTemplates: async (questionTemplates) => {
      let items = [];
      const formatCodeForm = {
        MSP: "multi-select",
        SSP: "single-select",
        C: "currency",
        D: "date",
        FC: "input",
      };
      const formatCodeType = {
        MSP: "multi-select",
        SSP: "select",
        C: "text",
        D: "date",
        FC: "text",
      };

      const questionFieldsIntName = {
        MSP: "EA_SA_rsAssessmentResponseOptions",
        SSP: "EA_SA_rsAssessmentResponseOptions",
        C: "EA_SA_curResponse",
        D: "EA_SA_ddResponse",
        FC: "EA_SA_txtaResponse",
      };

      for (let questionTemplateItem of questionTemplates) {
        const templateID = questionTemplateItem?.id;
        const questionResponse =
          __assessment_question_templates.get(templateID);

        const responseFormat =
          questionTemplateItem?.EA_SA_ddlResponseFormat || "FRES";
        const questionTemplateLabel = questionTemplateItem?.EA_SA_txtaQuestion;
        const order = questionTemplateItem?.EA_SA_intDisplayOrder;
        const isTimeInterval = questionTemplateItem?.EA_SA_cbAskPerTimeInterval;
        const isRequired = questionTemplateItem?.EA_SA_cbRequiredQuestion == 1;
        const field = `question-${questionTemplateItem?.id}`;
        const question_id = __assessment_question_templates.get(templateID).id;
        const relatedResponseOptions = await _DATA.getRelatedResponseOptions(
          question_id
        );

        let intervalQuestions = [];
        let responseOptions = [];

        const responseFormatValue = {
          MSP: relatedResponseOptions,
          SSP: questionResponse.EA_SA_rsAssessmentResponseOptions,
          C: questionResponse.EA_SA_curResponse,
          D: questionResponse.EA_SA_ddResponse,
          FC: questionResponse.EA_SA_txtaResponse,
        };

        // Interval is Checked
        if (isTimeInterval) {
          //Fetch Question with Attached Interval
          intervalQuestions = await _DATA.fetchQuestionsIntervals(templateID);
          __interval_questions.set(templateID, intervalQuestions);

          // Fetch Assessment Response
          responseOptions = await _DATA.fetchAssessmentResponseOptions(
            templateID
          );
          __response_options.set(templateID, responseOptions);
        }

        // Multi-Select && Single-Select
        if (responseFormat == "MSP" || responseFormat == "SSP") {
          // Fetch Assessment Response
          responseOptions = await _DATA.fetchAssessmentResponseOptions(
            templateID
          );
          __response_options.set(templateID, responseOptions);
        }

        items.push({
          form_object: formatCodeForm[responseFormat],
          id: templateID,
          question_id,
          field,
          label: questionTemplateLabel,
          type: formatCodeType[responseFormat],
          is_time_interval: isTimeInterval,
          value: responseFormatValue[responseFormat],
          question_field_integration_name:
            questionFieldsIntName[responseFormat],
          class: formatCodeForm[responseFormat],
          placeholder: "",
          order,
          responseOptions,
          intervalQuestions,
          validation: {
            required: isRequired,
          },
        });
      }

      return items;
    },

    handleSectionQuestions: async (typeId) => {
      // View
      const sectionHasContent =
        __pageType == "view"
          ? $(`#panel-${typeId}.type-panelbar`).html()
          : $(`#type-${typeId}.type-form .wizard-section`).length;

      if (sectionHasContent == "" || sectionHasContent == 0) {
        _UI.loader.start();

        // Get all Questions
        let assessmentQuestions = await _DATA.fetchQuestions(typeId);

        // Group By question Templates
        assessmentQuestions.map((item) => {
          const templateID = item.EA_SA_rsAssessmentQuestionTemplate;
          __assessment_question_templates.set(templateID, item);
          __assessment_questions.set(item.id, item);
        });

        // Get Related Question Template IDs from Questions
        let assessmentQuestionsIDs = assessmentQuestions.map(
          (item) => item.EA_SA_rsAssessmentQuestionTemplate
        );

        // Get Assessment Template records
        let assessmentTemplate =
          assessmentQuestionsIDs.length > 0
            ? await _DATA.fetchAssessmentQuestionTemplate(
                assessmentQuestionsIDs
              )
            : [];

        // Convert Question Templates to JSON format
        let assessmentQuestionTemplateJSON =
          await _FN.formatAssessmentQuestionTemplates(assessmentTemplate);

        if (assessmentQuestionTemplateJSON.length > 0) {
          const items = assessmentQuestionTemplateJSON;
          __pageType == "view"
            ? _UI.displayPanels(typeId, items)
            : await _UI.displayFormFields(typeId, { items });
        }

        _UI.loader.end();

        return;
      }
    },

    getAssessmentQuestionType: async (
      questionTypeID,
      sectionStatusesJSON,
      hasStatusJSON
    ) => {
      // Get Assessment Question Type Name By ID
      let assessmentTypeName = await _DATA.fetchAssessmentQuestionType(
        questionTypeID
      );
      assessmentTypeName = assessmentTypeName[0]["name"];

      // Set default status
      if (!hasStatusJSON) {
        __statusJSONDefault[`type-${questionTypeID}`] = "not-started";
      }

      // Store Question Type with Question Templates
      const status = hasStatusJSON
        ? JSON.parse(sectionStatusesJSON[0]["EA_SA_txtaSectionStatuses"])[
            `type-${questionTypeID}`
          ]
        : "not-started";

      __assessment_question_types.set(questionTypeID, {
        id: questionTypeID,
        status: hasStatusJSON ? status : "not-started",
        name: assessmentTypeName,
        items: [],
      });
    },

    getImpactAssessment: async () => {
      // Get Assessment Type by Related Assessment Question
      const assessmentTypes = await _DATA.fetchAssessmentQuestionTypes(
        ASSESSMENT_QUESTION_CONDITION
      );

      if (assessmentTypes.length > 0) {
        let hasStatusJSON = RECORD_INFO?.sectionStatusesJSON != "";

        // Get Object Status Section JSON
        let sectionStatusesJSON = await _DATA.fetchObjectSectionStatuses();
        if (hasStatusJSON) {
          __statusJSONDefault = JSON.parse(
            sectionStatusesJSON[0]["EA_SA_txtaSectionStatuses"]
          );
        }

        for (let type of assessmentTypes) {
          const questionTypeID = type["EA_SA_rfQuestionType"];
          await _FN.getAssessmentQuestionType(
            questionTypeID,
            sectionStatusesJSON,
            hasStatusJSON
          );
        }

        // Validate Section statuses and updates when empty
        if (!hasStatusJSON) {
          await _DATA.updateStatusJSON(__statusJSONDefault);
        }
      }

      return;
    },

    setAssessmentTemplateView: async () => {
      __steps = [];
      __assessment_question_types.forEach((type, key) => {
        // Set Panel dataSource
        const questionTypeID = type.id;
        const panelList = type.items.map((item) => {
          const isTimeInterval = item.is_time_interval;
          const templateID = item.id;
          const templateType = item.type;
          let panelContent = { text: "No answer." };

          if (isTimeInterval) {
            panelContent = {
              text: _UI.renderTimeIntervalTable(templateID),
              encoded: false,
            };
          } else if (item.value) {
            if (templateType == "select") {
              const responseID = item?.value;
              const responseOptions = __response_options
                .get(templateID)
                .filter((item) => item.id == responseID);
              panelContent.text =
                responseOptions.length > 0
                  ? responseOptions[0]?.name
                  : "-- Please Select --";
            } else if (templateType == "multi-select") {
              const responseID = item?.value;
              let responseOptions = __response_options
                .get(templateID)
                .filter((item) => responseID.indexOf(item.id) > -1);

              responseOptions = responseOptions.map((item) => {
                return item.name;
              });
              panelContent.text =
                responseOptions.length > 0
                  ? responseOptions.join(", ")
                  : "-- Please Select --";
            } else {
              panelContent.text = item.value != "null" ? item.value : " ";
            }
          }

          return {
            text: item.label,
            encoded: false,
            items: [panelContent],
          };
        });

        // Store Panel by Question Type
        __question_type_panels.set(questionTypeID, panelList);

        let customButton =
          __assessment_question_types.size > 1
            ? {}
            : {
                buttons: [
                  {
                    name: "Next",
                    enabled: false,
                  },
                ],
              };

        // Add Assessment Question Templates per step(Assessment Question Type)
        __steps.push({
          title: type?.name,
          id: type.id,
          content: _UI.kendoPanel(type.id),
          className: `type-${type.id}`,
          pager: false,
          icon: _UI.stepIcons(`type-${type.id}`),
          ...customButton,
        });
      });

      return;
    },

    updateQuestions: async () => {
      __question_template_responses.forEach(
        async ({ questionID, field, value }, key) => {
          const fields = {};
          fields[field] = value == "null" ? "" : value;

          await _DATA.updateQuestion(questionID, fields);
        }
      );

      __question_interval_responses.forEach(async ({ field, value }, key) => {
        const fields = {};
        fields[field] = value;

        await _DATA.updateQuestion(key, fields);
      });

      rbf_growlSuccess("Successfully Saved.");
      __hasUpdate = false;

      return true;
    },

    setAssessmentTemplateFields: () => {
      __steps = [];

      return new Promise((resolve, rejected) => {
        __assessment_question_types.forEach(async (type, key) => {
          let stepContent = `<form id="type-${type.id}" class="type-form">`;
          const templatesFieldHTML = await _FORM.render(type);

          // Get Assessment Question Templates
          templatesFieldHTML.forEach((value) => {
            stepContent += value;
          });
          stepContent += _UI.footerSection(type.id);
          stepContent += `</form>`;

          let customButton = {};
          if (__assessment_question_types.size == 1) {
            customButton = {
              buttons: [
                {
                  name: "Done",
                  enabled: __pageType == "selector",
                  click: _BIND.handleWizardDone,
                },
              ],
            };
          }

          // Add Assessment Question Templates per step(Assessment Question Type)
          __steps.push({
            title: type?.name,
            content: stepContent,
            className: `type-${type.id}`,
            pager: false,
            id: type.id,
            icon: _UI.stepIcons(`type-${type.id}`),
            ...customButton,
          });

          if (__steps.length == __assessment_question_types.size) {
            resolve(__steps);
          }
        });

        if (__assessment_question_types.size == 0) {
          resolve([]);
        }
      });
    },
  };

  const _DATA = {
    fetchAssessmentQuestionTemplate: async (ids) => {
      try {
        const condition = `id IN (${ids}) ORDER BY EA_SA_intDisplayOrder ASC`;
        const fields = [
          "id",
          "EA_SA_ddlResponseFormat#code",
          "EA_SA_cbIncludeFileUpload",
          "EA_SA_txtaQuestion",
          "EA_SA_intDisplayOrder",
          "EA_SA_cbAskPerTimeInterval",
          "EA_SA_cbRequiredQuestion",
          "EA_SA_cbIncludeFileUpload",
          "EA_SA_intQuestionWeighting",
        ];

        console.log();

        const results = await _RB.selectQuery(
          fields,
          "EA_SA_AssessmentQuestionTemplate",
          condition,
          10000,
          true
        );
        return results;
      } catch (error) {
        console.log("Error: fetchAssessmentQuestionTemplate ", error);
      }
    },

    fetchQuestionsIntervals: async (templateID) => {
      try {
        // EA_SA_rsProcess=${RECORD_INFO.id} AND
        const condition = `${ASSESSMENT_QUESTION_CONDITION} AND EA_SA_rsAssessmentQuestionTemplate=${templateID} AND EA_SA_rsTimeInterval<>'null' ORDER BY EA_SA_rfTimeInSeconds ASC`;
        const fields = [
          "id",
          "name",
          "EA_SA_rfQuestionType",
          "EA_SA_txtaResponse",
          "EA_SA_ddResponse",
          "EA_SA_curResponse",
          "EA_SA_txtaAdditionalInformation",
          "EA_SA_rsTimeInterval",
          "EA_SA_rsAssessmentResponseOptions",
          "EA_SA_rsAssessmentQuestionTemplate",
          "EA_SA_rfTimeInterval",
        ];

        const results = await _RB.selectQuery(
          fields,
          "EA_SA_AssessmentQuestion",
          condition,
          10000,
          true
        );

        return results;
      } catch (error) {
        console.log("Error: fetchQuestions ", error);
      }
    },

    fetchAssessmentResponseOptions: async (templateID) => {
      try {
        const condition = `EA_SA_rsAssessmentQuestionTemplate=${templateID} ORDER BY EA_SA_intDisplayOrder ASC`;

        const results = await _RB.selectQuery(
          ["id", "name"],
          "EA_SA_AssessmentResponseOption",
          condition,
          10000,
          true
        );
        return results;
      } catch (error) {
        console.log("Error: fetchAssessmentResponseOptions ", error);
      }
    },

    fetchQuestions: async (questionTypeID) => {
      try {
        const condition = `${RECORD_INFO.questionRelName}=${RECORD_INFO.id} AND EA_SA_rfQuestionType=${questionTypeID} AND EA_SA_rsAssessmentQuestionTemplate<>'null'`;
        const fields = [
          "id",
          "name",
          "EA_SA_rfQuestionType",
          "EA_SA_txtaResponse",
          "EA_SA_ddResponse",
          "EA_SA_curResponse",
          "EA_SA_txtaAdditionalInformation",
          "EA_SA_rsTimeInterval",
          "EA_SA_rsAssessmentResponseOptions",
          "EA_SA_rsAssessmentQuestionTemplate",
        ];

        const results = await _RB.selectQuery(
          fields,
          "EA_SA_AssessmentQuestion",
          condition,
          10000,
          true
        );
        return results;
      } catch (error) {
        console.log("Error: fetchQuestions ", error);
      }
    },

    fetchAssessmentQuestionTypes: async (assessmentQuestionCondition) => {
      try {
        const condition = `${assessmentQuestionCondition} AND EA_SA_rfQuestionType<>'null' GROUP BY EA_SA_rfQuestionType ORDER BY EA_SA_rfQuestionType`;

        const results = await _RB.selectQuery(
          ["EA_SA_rfQuestionType"],
          "EA_SA_AssessmentQuestion",
          condition,
          10000,
          true
        );
        return results;
      } catch (error) {
        console.log("Error: fetchAssessmentQuestionTypes ", error);
      }
    },

    fetchAssessmentQuestionType: async (id) => {
      try {
        const condition = `id=${id}`;
        const results = await _RB.selectQuery(
          ["name"],
          "EA_SA_AssessmentQuestionType",
          condition,
          1,
          true
        );
        return results;
      } catch (error) {
        console.log("Error: fetchAssessmentQuestionType ", error);
      }
    },

    fetchObjectSectionStatuses: async () => {
      try {
        const condition = `id=${RECORD_INFO?.id}`;

        const results = await _RB.selectQuery(
          ["EA_SA_txtaSectionStatuses"],
          RECORD_INFO?.objectIntegrationName,
          condition,
          1,
          true
        );
        return results;
      } catch (error) {
        console.log("Error: fetchObjectSectionStatuses ", error);
      }
    },

    updateStatusJSON: async (value) => {
      try {
        let fields = {
          EA_SA_txtaSectionStatuses: JSON.stringify(value),
        };
        const results = await _RB.updateRecord(
          RECORD_INFO.objectIntegrationName,
          RECORD_INFO.id,
          fields
        );

        return results;
      } catch (error) {
        console.log("Error: updateStatusJSON ", error);
      }
    },

    updateQuestion: async (recordID, fields) => {
      try {
        const results = await _RB.updateRecord(
          "EA_SA_AssessmentQuestion",
          recordID,
          fields
        );
        return results;
      } catch (error) {
        console.log("Error: updateQuestion ", error);
      }
    },

    getRelatedResponseOptions: async (questionID) => {
      try {
        // Response Options Relationship Integration Name: R7996162
        const results = await _RB.getRelatedFields(
          "R7996162",
          ",EA_SA_AssessmentQuestion",
          questionID,
          "id"
        );
        return results;
      } catch (error) {
        console.log("Error: getRelatedResponseOptions ", error);
      }
    },
  };
  return {
    init,
    toggleApplicationImpactAssesmentTab:
      _UI.toggleApplicationImpactAssesmentTab,
    bindScripts: _BIND.bindDependencyScript,
  };
})();
