const User= require('../models/User.js');
const Session= require('../models/Session.js');


async function getPopulatedSessions(id){

    return Session.findById(id).populate("clientID", "name email role").populate('therapistID', "name email role specialization");

}

exports.createSession = async (req, res) => {
  try {
    if (req.user.role !== "client" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only clients can book sessions" });
    }

    const { therapistId, sessionDate, mode, notes } = req.body;
    if (!therapistId || !sessionDate) {
      return res.status(400).json({ message: "therapistId and sessionDate are required" });
    }
    const therapist = await User.findById(therapistId);
    if (!therapist || therapist.role !== "therapist") {
      return res.status(400).json({ message: "therapistId must be a valid therapist" });
    }
  
    const date = new Date(sessionDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid sessionDate. Use ISO string." });
    }
    if (date < new Date()) {
      return res.status(400).json({ message: "sessionDate must be in the future" });
    }

    const session = await Session.create({
      clientId: req.user.id,
      therapistId,
      sessionDate: date,
      mode,
      notes
    });

const populated = await getPopulatedSession(session._id);
    return res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const isClient = session.clientId.toString() === req.user.id;
    const isTherapist = session.therapistId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (!isClient && !isTherapist && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const populated = await getPopulatedSession(session._id);
    return res.json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "status is required" });

    const valid = ["booked", "confirmed", "completed", "cancelled"];
    if (!valid.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const isClient = session.clientId.toString() === req.user.id;
    const isTherapist = session.therapistId.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";
    if (status === "confirmed" || status === "completed") {
      
      if (!isTherapist && !isAdmin) return res.status(403).json({ message: "Only the assigned therapist or admin can confirm/complete" });
    } else if (status === "cancelled") {
      
      if (!isClient && !isAdmin) return res.status(403).json({ message: "Only the booking client or admin can cancel" });
    } else if (status === "booked") {
       
      if (!isAdmin) return res.status(403).json({ message: "Only admin can set status to booked" });
    }
    session.status = status;
    await session.save();

    const populated = await getPopulatedSession(session._id);
    return res.json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getMySessions = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role === "client") filter.clientId = req.user.id;
    else if (req.user.role === "therapist") filter.therapistId = req.user.id;
     
    const sessions = await Session.find(filter)
      .sort({ sessionDate: -1 })
      .populate("clientId", "name email")
      .populate("therapistId", "name specialization email");

    return res.json(sessions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};