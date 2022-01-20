const Role = require("../models/index").role;
const StatusCovid = require("../models/index").statusCovidUser;
const TreatmentLocation = require("../models/index").treatmentLocation;


exports.initial = () => {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
  StatusCovid.create({
    status: "Đã khỏi bệnh",
  });
  StatusCovid.create({
    status: "F0",
  });
  StatusCovid.create({
    status: "F1",
  });
  StatusCovid.create({
    status: "F2",
  });
  StatusCovid.create({
    status: "F3",
  });
  TreatmentLocation.create({
    name: "Bệnh viện A",
    capacity: 1000,
    current: 0,
  });
  TreatmentLocation.create({
    name: "Trung tâm y tế B",
    capacity: 200,
    current: 0,
  });
  TreatmentLocation.create({
    name: "Bệnh Viện C",
    capacity: 1000,
    current: 0,
  });
  TreatmentLocation.create({
    name: "Bệnh Viện D",
    capacity: 5000,
    current: 0,
  });
  TreatmentLocation.create({
    name: "Trung tâm y tế E",
    capacity: 1000,
    current: 0,
  });
};
