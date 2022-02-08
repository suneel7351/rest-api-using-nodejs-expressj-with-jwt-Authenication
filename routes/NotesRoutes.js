const fetuser = require("../middleware/fetuser");
const { body } = require("express-validator");
function NotesRoutes(app) {
  app.get(
    "/getAllnotes",
    fetuser,
    require("../controller/NotesController")().getAllnotes
  );
  app.post(
    "/addnote",
    fetuser,
    [
      body("title", "Title should not empty").exists(),
      body("description", "Description should not empty").exists(),
    ],
    require("../controller/NotesController")().addnote
  );
  app.put(
    "/updatenote/:id",
    fetuser,
    require("../controller/NotesController")().updatenotes
  );
  app.delete('/deletenote/:id',fetuser,require('../controller/NotesController')().deletenotes)
}

module.exports = NotesRoutes;
