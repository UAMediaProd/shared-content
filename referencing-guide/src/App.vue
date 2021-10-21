<template>
  <div id="app">
    <div class="adx-direction-warning" v-if="editMode">
      <h5>Warning!</h5>
      <p>
        You're currently in edit mode for this activity. Changing the content
        here and pressing 'Save Changes' will
        <em>Change the content that gets shown to users!</em>
      </p>
    </div>

    <div class="wrapper">
      <div class="contain">
        <div class="col" :class="[selected2 ? 'itemCol' : '']">
          <div><h2>Item type</h2></div>
          <!-- main headings -->
          <div
            v-for="(ref, ind) in refList"
            v-bind:key="ref.ID"
            class="butts"
            @click="chooseLevelOne(ind)"
            :class="[selected == ind ? 'activated' : '']"
          >
            {{ ref.ID }}
          </div>
        </div>

        <div class="col" :class="[selected2 ? 'subCol' : '']">
          <div><h2>Item sub-type</h2></div>
          <div
            v-for="(refSection, index) in level1Select.sections"
            v-bind:key="index"
          >
            <!-- sub-heading -->

            <div
              v-for="(value, key) in refSection"
              v-bind:key="value"
              class="butts col2"
              @click="chooseLevelTwo(key)"
              :class="[selected2 == key ? 'activated' : '']"
            >
              {{ key }}
            </div>
          </div>

          <!-- show things -->
        </div>
        <div class="col contentCol" :class="[level2Select ? '' : 'showContent' ]">
          <transition name="fade">
            <div
              v-if="level2Select"
              class="content"
              v-bind:class="[editMode ? 'editing' : '']"
            >
              <div class="breadcrumbs">
                <p v-if="level2Select">
                  <button class='butts col2' @click="reset()">Choose another type/sub-type</button>
                </p>

                <p>
                  <strong>{{ level1Select.ID }} / {{ selected2 }}</strong>
                </p>
              </div>

              <div v-if="!editMode" class="refInfo" v-html="level2Select"></div>

              <editor
                id="editing"
                v-if="editMode"
                api-key="arepix5k1adgokntbf5620tt3u4jrkmvvstjeydhd2c5er5q"
                :inline="true"
                :init="{
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount',
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help',
                }"
                v-model="level2Select"
              />
            </div>
          </transition>
          <button
            v-if="editMode"
            class="butts edit"
            @click="saveChanges"
            :class="[saving ? 'saving' : '']"
          >
            Save changes
            <div class="loader">Loading...</div>
          </button>
        </div>
      </div>
    </div>

   
  </div>
</template>

<script>
import REFS from "./assets/test.json";
import Editor from "@tinymce/tinymce-vue";
import axios from "axios";
import { showAt, hideAt } from "vue-breakpoints";

export default {
  name: "App",
  components: {
    Editor,
    hideAt,
    showAt,
  },
  data: function () {
    return {
      refList: [],
      level1Select: "",
      level2Select: "",
      selected: null,
      selected2: null,
      editMode: false,
      editorOptions: {},
      saving: false,
    };
  },
  mounted: function () {
    this.refList = REFS;

    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("editing") && urlParams.get("editing") == "true") {
      // this.editMode = true;
    } else {
      this.editMode = false;
    }
  },
  methods: {
    chooseLevelOne(num) {
      window.scrollTo(0, 0);
      this.level1Select = this.refList[num];

      this.selected = num;
      this.selected2 = null;
      this.level2Select = null;
    },
    chooseLevelTwo(item) {
      window.scrollTo(0, 0);
      this.level2Select = null;
      let that = this;
      // setTimeout to delay rendering, allowing the transition to trigger!
      setTimeout(() => {
        let jsonObj = that.level1Select.sections[0];

        that.level2Select = jsonObj[item];
        that.selected2 = item;
        console.log(that.selected2);
      }, 20);
    },

    reset() {
      window.scrollTo(0, 0);
      console.log("Resetting!");
      this.selected2 = null;
      this.level2Select = "";
    },

    saveChanges() {
      this.saving = true;
      this.refList[this.selected].sections[0][this.selected2] =
        this.level2Select;

      let updatedContent = btoa(
        unescape(encodeURIComponent(JSON.stringify(this.refList)))
      );

      var ab = atob("Z2hwX2VkbUhhVWx2MHZTWXh1Y2RENENDaTNkU3JFcXFpVTRLaXBxdw==");

      var that = this;
      axios
        .get(
          "https://api.github.com/repos/UAMediaProd/referencing-guide/contents/src/assets/test.json"
        )
        .then(function (res) {
          var fileBiz = res.data;

          axios({
            method: "put",
            url: "https://api.github.com/repos/UAMediaProd/referencing-guide/contents/src/assets/test.json",
            headers: {
              Authorization: "token " + ab,
            },
            data: {
              message: "Updated content through Editing Mode",
              content: updatedContent,
              sha: fileBiz.sha,
            },
          })
            .then(function (response) {
              setTimeout(function () {
                console.log("Success");
                //add in stuff here to show a success!

                //show success message
                that.$swal({
                  title: "Save complete!",
                  text: "Your changes have been saved. It may take just a sec to show up in the original page.",
                  icon: "success",
                  confirmButtonText: "Okay",
                });
                that.saving = false;
              }, 8000);
            })
            .catch(function (err) {
              console.log("ERROR", err);
            });
        });
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400;1,700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Crimson+Text:ital@0;1&display=swap");

body {
  margin: 0;
}

h2 {
  font-size: 1.2em;
}

#app {
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #303030;
  font-size: 1em;
  line-height: 1.7;
}

.headerbar {
  background: #102535;
  margin: 0;
  min-height: 30px;
  padding: 1em;
}

.secondarybar {
  background: #005a9c;
  margin: 0;
  min-height: 20px;
  padding: 1em;
  margin-bottom: 3em;
}

.secondarybar a {
  color: #fff;
  text-decoration: none;
}

a {
  color: #005a9c;
}

.wrapper {
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.footer {
  background: #102535;
  margin: 0;
  color: white;
  min-height: 150px;
  padding: 1em;
}

.contain {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  margin: 1em;
  min-height: 100vh;
}

.col {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  flex-basis: 20%;
  flex-grow: 1;
  background: #f5f5f5;
  margin: 0.5em;
  padding: 0.5em;
}

.contentCol {
  background: none;
}

.breadcrumbs {
  display: none;
}

@media (max-width: 980px) {
  .contentCol {
    flex-basis: 100%;
  }

  .showContent {
    display: none;
  }

  .contain {
    flex-wrap: nowrap;
  }

  .itemCol,
  .subCol {
    display: none;
  }

  .breadcrumbs {
    display: inline-block;
  }

  .wrapper, .contain {
    margin: 0;
  }

  .wrapper {
    width: 100%;
    max-width: 100% !important;
  }
}

.example {
  background: #ececec;
  padding: 2em 2em 2em 3em;
  border-radius: 3px;
  line-height: 1.5;
  font-family: "Georgia", serif;
  font-size: 1em;
}

.textExample {
  background: #ececec;
  font-family: "Georgia", serif;
  font-size: 1em;
  padding: 0.3em;
  border-radius: 3px;
}

.butts {
  vertical-align: middle;
  margin: 0 0 1rem 0;
  font-family: inherit;
  padding: 1em 1.5em;
  border: 1px solid transparent;
  border-radius: 0;
  transition: all 0.25s ease-out, color 0.25s ease-out;
  font-size: 0.9rem;
  line-height: 1;
  text-align: center;
  cursor: pointer;
  background-color: #005a9c;
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
  /* max-width: 80%; */
}

.col2 {
  border: 1px solid #000;
  color: #000;
  background: none;
}

.butts:hover {
  background: #004d85;
}

.col2:hover {
  border-color: #8a8a8a;
  background: none;
  color: #000;
}

.activated {
  background: #102535;
  color: white;
}

.activated:hover {
  background: #102535;
  color: white;
}

.content {
  padding: 1em;
}

.fade-enter-active {
  transition: opacity 1s;
}

.fade-enter,
.fade-leave-active,
.fade-leave-to {
  opacity: 0;
}

.refInfo {
  transition: all 1s linear;
}

div.adx-direction,
div.adx-direction-correct,
div.adx-direction-incorrect,
div.adx-direction-warning,
div.adx-direction-question,
div.adx-direction-info {
  position: relative;
  padding: 0.833rem;
  margin: 1rem 1.728rem;
  background: #f8f9f9;
}
div.adx-direction:before,
div.adx-direction-correct:before,
div.adx-direction-incorrect:before,
div.adx-direction-warning:before,
div.adx-direction-question:before,
div.adx-direction-info:before {
  position: absolute;
  top: 0;
  margin-left: -2.074rem;
  margin-right: 1.728rem;
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23949a9e' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3C/svg%3E");
  background: #949a9e;
  padding: 0.579rem;
  padding-top: 1.44rem;
  height: calc(100% - 0.579rem - 1.44rem);
}
div.adx-direction-info {
  background: #e6eaf3;
}
div.adx-direction-info:before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='12' y1='16' x2='12' y2='12'%3E%3C/line%3E%3Cline x1='12' y1='8' x2='12.01' y2='8'%3E%3C/line%3E%3C/svg%3E");
  background: #052a8a;
}
div.adx-direction-question {
  background: #f1eef9;
}
div.adx-direction-question:before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3'%3E%3C/path%3E%3Cline x1='12' y1='17' x2='12.01' y2='17'%3E%3C/line%3E%3C/svg%3E");
  background: #7356c5;
}
div.adx-direction-warning {
  background: #fff6e9;
}
div.adx-direction-warning:before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'%3E%3C/path%3E%3Cline x1='12' y1='9' x2='12' y2='13'%3E%3C/line%3E%3Cline x1='12' y1='17' x2='12.01' y2='17'%3E%3C/line%3E%3C/svg%3E");
  background: #ffa423;
}
div.adx-direction-incorrect {
  background: #fbebea;
}
div.adx-direction-incorrect:before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='15' y1='9' x2='9' y2='15'%3E%3C/line%3E%3Cline x1='9' y1='9' x2='15' y2='15'%3E%3C/line%3E%3C/svg%3E");
  background: #d4322c;
}
div.adx-direction-correct {
  background: #e9f5ed;
}
div.adx-direction-correct:before {
  content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 11.08V12a10 10 0 1 1-5.93-9.14'%3E%3C/path%3E%3Cpolyline points='22 4 12 14.01 9 11.01'%3E%3C/polyline%3E%3C/svg%3E");
  background: #22964f;
}
div.adx-direction > *,
div.adx-direction-info > *,
div.adx-direction-question > *,
div.adx-direction-warning > *,
div.adx-direction-incorrect > *,
div.adx-direction-correct > * {
  margin-left: 1.44rem;
}

.editing {
  border: 1px solid #ededed;
}

.saving {
  background: #9ac0dc;
}

.loader {
  display: none;
  font-size: 5px;
  width: 1em;
  height: 1em;
  border-radius: 50%;
  text-indent: -9999em;
  -webkit-animation: load5 1.1s infinite ease;
  animation: load5 1.1s infinite ease;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  /* text-align: right; */
  margin-left: auto;
  top: -8px;
  position: relative;
}
@-webkit-keyframes load5 {
  0%,
  100% {
    box-shadow: 0em -2.6em 0em 0em #ffffff,
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.5),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
  }
  12.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7),
      1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
  }
  25% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em #ffffff,
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }
  37.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.7), 1.75em 1.75em 0 0em #ffffff,
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.5),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em #ffffff,
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }
  62.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.7), -1.8em 1.8em 0 0em #ffffff,
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }
  75% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.5),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em #ffffff,
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }
  87.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.7), -1.8em -1.8em 0 0em #ffffff;
  }
}
@keyframes load5 {
  0%,
  100% {
    box-shadow: 0em -2.6em 0em 0em #ffffff,
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.5),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7);
  }
  12.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.7),
      1.8em -1.8em 0 0em #ffffff, 2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5);
  }
  25% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.5),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.7), 2.5em 0em 0 0em #ffffff,
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }
  37.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.5),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.7), 1.75em 1.75em 0 0em #ffffff,
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }
  50% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.5),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.7), 0em 2.5em 0 0em #ffffff,
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.2),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }
  62.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.5),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.7), -1.8em 1.8em 0 0em #ffffff,
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }
  75% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.5),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.7), -2.6em 0em 0 0em #ffffff,
      -1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2);
  }
  87.5% {
    box-shadow: 0em -2.6em 0em 0em rgba(255, 255, 255, 0.2),
      1.8em -1.8em 0 0em rgba(255, 255, 255, 0.2),
      2.5em 0em 0 0em rgba(255, 255, 255, 0.2),
      1.75em 1.75em 0 0em rgba(255, 255, 255, 0.2),
      0em 2.5em 0 0em rgba(255, 255, 255, 0.2),
      -1.8em 1.8em 0 0em rgba(255, 255, 255, 0.5),
      -2.6em 0em 0 0em rgba(255, 255, 255, 0.7), -1.8em -1.8em 0 0em #ffffff;
  }
}

.saving .loader {
  display: inherit;
}

.swal2-popup {
  font-family: "Open Sans", sans-serif !important;
}

.edit {
  width: 100%;
  max-width: 100%;
  margin-top: 1em;
}
</style>
