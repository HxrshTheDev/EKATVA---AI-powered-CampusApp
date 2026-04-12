const supabase = require("../config/supabase");

class EventService {
  // Create event
  async createEvent(eventData, organizerId) {
    const newEvent = {
        organizer_id: organizerId,
        title: eventData.title,
        description: eventData.description,
        start_date: eventData.startDate,
        end_date: eventData.endDate,
        location: eventData.location,
        capacity: eventData.capacity || 100,
        associated_club_id: eventData.associatedClubId
    };

    const { data: event, error } = await supabase
      .from("events")
      .insert([newEvent])
      .select(`
        *,
        organizer:users!organizer_id(first_name, last_name, profile_image)
      `)
      .single();

    if (error) throw error;
    return event;
  }

  // Get all events with pagination
  async getAllEvents(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: events, count, error } = await supabase
      .from("events")
      .select(`
        *,
        organizer:users!organizer_id(first_name, last_name, profile_image),
        club:clubs!associated_club_id(name)
      `, { count: 'exact' })
      .eq("is_active", true)
      .order('start_date', { ascending: true })
      .range(from, to);

    if (error) throw error;

    return {
      events,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Get event by ID
  async getEventById(eventId) {
    const { data: event, error } = await supabase
      .from("events")
      .select(`
        *,
        organizer:users!organizer_id(first_name, last_name, email, profile_image),
        registrations:event_registrations(user:users(id, first_name, last_name, profile_image)),
        club:clubs!associated_club_id(name)
      `)
      .eq("id", eventId)
      .single();

    if (error || !event) {
      throw new Error("Event not found");
    }

    return event;
  }

  // Register for event
  async registerForEvent(eventId, userId) {
    // 1. Check event and capacity
    const { data: event, error: fetchError } = await supabase
      .from("events")
      .select("id, capacity, is_registration_open")
      .eq("id", eventId)
      .single();

    if (fetchError || !event) throw new Error("Event not found");
    if (!event.is_registration_open) throw new Error("Registration is closed for this event");

    const { count: regCount } = await supabase
      .from("event_registrations")
      .select("id", { count: 'exact', head: true })
      .eq("event_id", eventId);

    if (regCount >= event.capacity) throw new Error("Event is full");

    // 2. Register
    const { error: regError } = await supabase
      .from("event_registrations")
      .insert([{ event_id: eventId, user_id: userId }]);

    if (regError) {
      if (regError.code === '23505') throw new Error("Already registered for this event");
      throw regError;
    }

    return {
      registered: true,
      totalRegistrations: regCount + 1
    };
  }

  // Unregister from event
  async unregisterFromEvent(eventId, userId) {
    const { error } = await supabase
      .from("event_registrations")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", userId);

    if (error) throw new Error("Failed to unregister");

    return { unregistered: true };
  }

  // Mark attendance
  async markAttendance(eventId, userId) {
    const { error } = await supabase
      .from("event_registrations")
      .update({ attended: true })
      .eq("event_id", eventId)
      .eq("user_id", userId);

    if (error) throw new Error("Registration not found or failed to update");

    return { attended: true };
  }

  // Get user's events
  async getUserRegisteredEvents(userId, page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: registrations, count, error } = await supabase
      .from("event_registrations")
      .select("event:events(*, organizer:users!organizer_id(first_name, last_name, profile_image))", { count: 'exact' })
      .eq("user_id", userId)
      .range(from, to);

    if (error) throw error;

    return {
      events: registrations.map(r => r.event),
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Create club
  async createClub(clubData, presidentId) {
    // 1. Create club
    const { data: club, error: createError } = await supabase
      .from("clubs")
      .insert([{
        name: clubData.name,
        description: clubData.description,
        president_id: presidentId,
        category: clubData.category,
        capacity: clubData.capacity || 50
      }])
      .select()
      .single();

    if (createError) throw createError;

    // 2. Add president as member
    await supabase
      .from("club_members")
      .insert([{ club_id: club.id, user_id: presidentId, role: 'president' }]);

    return club;
  }

  // Get all clubs
  async getAllClubs(page = 1, limit = 10) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: clubs, count, error } = await supabase
      .from("clubs")
      .select("*, president:users!president_id(first_name, last_name, profile_image)", { count: 'exact' })
      .eq("is_active", true)
      .range(from, to);

    if (error) throw error;

    return {
      clubs,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
      },
    };
  }

  // Join club
  async joinClub(clubId, userId) {
    // 1. Check capacity
    const { data: club, error: fetchError } = await supabase
      .from("clubs")
      .select("id, capacity")
      .eq("id", clubId)
      .single();

    if (fetchError || !club) throw new Error("Club not found");

    const { count: memberCount } = await supabase
      .from("club_members")
      .select("id", { count: 'exact', head: true })
      .eq("club_id", clubId);

    if (memberCount >= club.capacity) throw new Error("Club is full");

    // 2. Add member
    const { error: joinError } = await supabase
      .from("club_members")
      .insert([{ club_id: clubId, user_id: userId, role: 'member' }]);

    if (joinError) {
      if (joinError.code === '23505') throw new Error("Already a member of this club");
      throw joinError;
    }

    return { joined: true };
  }
}

module.exports = new EventService();
