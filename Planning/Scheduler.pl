:- module(scheduler, [
    obtain_better_sol_occupancy/5,
    obtain_better_sol/5
    
]).

% Dynamic declarations
:- dynamic scheduled/1.
:- dynamic better_sol/5.
:- dynamic iteration_count/1.
:- dynamic scheduled_surgery/1.
:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:- dynamic agenda_operation_room/3.
:- dynamic agenda_operation_room1/3.


% Time are in minutes of a day so 720 is 12:00 and 1440 is 24:00
% staffCode, date, schedule for the date [(start, end, type of meeting)] - lists are sorted


% For the Complexity Study

%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).
surgery(so2,45,60,45).
surgery(so3,45,90,45).
surgery(so4,45,75,45).

agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).
agenda_staff(d004,20241028,[(850,900,m02),(940,980,c04)]).
/*
agenda_staff(n001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(t001,20241028,[(720,790,m01),(1080,1140,c01)]).


agenda_staff(n002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(t002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).


agenda_staff(n003,20241028,[(720,790,m01),(910,980,m02)]).
agenda_staff(t003,20241028,[(720,790,m01),(910,980,m02)]).


agenda_staff(n004,20241028,[(850,900,m02),(940,980,c04)]).
agenda_staff(t004,20241028,[(850,900,m02),(940,980,c04)]).
*/

%agenda_staff(d004,20241028,[(850,900,m02),(940,980,c04)]).

timetable(d001,20241028,(480,1200)).
timetable(d002,20241028,(500,1440)).
timetable(d003,20241028,(520,1320)).
timetable(d004,20241028,(620,1020)).

/*
timetable(n001,20241028,(480,1200)).
timetable(t001,20241028,(480,1200)).


timetable(n002,20241028,(500,1440)).
timetable(t002,20241028,(500,1440)).


timetable(n003,20241028,(520,1320)).
timetable(t003,20241028,(520,1320)).


timetable(n004,20241028,(620,1020)).
timetable(t004,20241028,(620,1020)).
*/

surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
/*
surgery_id(so100004,so2).
surgery_id(so100005,so4).
surgery_id(so100006,so2).
surgery_id(so100007,so3).
surgery_id(so100008,so2).
surgery_id(so100009,so2).
surgery_id(so100010,so2).
surgery_id(so100011,so4).
*/
%surgery_id(so100012,so2).
%surgery_id(so100013,so2).

assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
/*
assignment_surgery(so100004,d001).
assignment_surgery(so100004,d002).
assignment_surgery(so100005,d002).
assignment_surgery(so100005,d003).
assignment_surgery(so100006,d001).
assignment_surgery(so100007,d003).
assignment_surgery(so100008,d004).
assignment_surgery(so100008,d003).
*/


/*
assignment_surgery(so100001,n001).
assignment_surgery(so100001,t001).


assignment_surgery(so100002,n002).
assignment_surgery(so100002,t002).


assignment_surgery(so100003,n003).
assignment_surgery(so100003,t003).
*/

/*

assignment_surgery(so100004,n001).
assignment_surgery(so100004,t001).

assignment_surgery(so100004,n002).
assignment_surgery(so100004,t002).


assignment_surgery(so100005,n002).
assignment_surgery(so100005,t002).

assignment_surgery(so100005,n003).
assignment_surgery(so100005,t003).

assignment_surgery(so100006,n001).
assignment_surgery(so100006,t001).


assignment_surgery(so100007,n003).
assignment_surgery(so100007,t003).


assignment_surgery(so100008,n004).
assignment_surgery(so100008,t004).

assignment_surgery(so100008,n003).
assignment_surgery(so100008,t003).
*/

%assignment_surgery(so100009,d002).
%assignment_surgery(so100009,d004).

%assignment_surgery(so100010,d003).

%assignment_surgery(so100011,d001).
%assignment_surgery(so100012,d001).
%assignment_surgery(so100013,d004).

/*
assignment_surgery(so100009,n002).
assignment_surgery(so100009,t002).

assignment_surgery(so100009,n004).
assignment_surgery(so100009,t004).


assignment_surgery(so100010,n003).
assignment_surgery(so100010,t003).


*/

% Add to dynamic declarations at top of file
:- dynamic iteration_count/1.
:- dynamic best_solution/1.
:- dynamic best_time/1.

:- initialization(init_nb_vars).

init_nb_vars :-
    nb_setval(iteration_count, 0).

% Replace init_globals
init_globals :-
    retractall(iteration_count(_)),
    retractall(best_solution(_)),
    retractall(best_time(_)),
    assertz(iteration_count(0)),
    assertz(best_solution([])),
    assertz(best_time(1441)).

% Replace init_counters  
init_counters :-
    retractall(iteration_count(_)),
    retractall(better_sol(_, _, _, _, _)),
    assertz(iteration_count(0)),
    assertz(better_sol(_, _, _, _, 1441)).

% Replace increment_counter
increment_counter :-
    iteration_count(Count),
    NewCount is Count + 1,
    retractall(iteration_count(_)),
    assertz(iteration_count(NewCount)).

% Replace cleanup_globals
cleanup_globals :-
    retractall(best_solution(_)),
    retractall(best_time(_)).





% Current schedule for a specific room (roomId, date, schedule for the date [(start, end, surgeryId)] - lists are sorted)
agenda_operation_room(or1, 20241028, [(520, 579, so100000), (1000, 1059, so099999)]).

% agenda_operation_room(or1, 20241028, []).

% Uses agenda0 to find the first "free" section of a day based on the first scheduled event.
% Then, uses agenda1 to find the "free" sections of the day based on all other scheduled events.

% Base case: If there are no scheduled events, the entire day is free.
free_agenda0([], [(0, 1440)]).

% If the first surgery starts at the beginning of the day (at time 0):
free_agenda0([(0, EndTime, _) | RemainingSchedule], FreeSlots) :- 
    !, 
    free_agenda1([(0, EndTime, _) | RemainingSchedule], FreeSlots).

% If the first surgery starts after the beginning of the day:
free_agenda0([(StartTime, EndTime, _) | RemainingSchedule], [(0, FreeUntil) | FreeSlots]) :- 
    FreeUntil is StartTime - 1,
    free_agenda1([(StartTime, EndTime, _) | RemainingSchedule], FreeSlots).

% If the last scheduled event ends before the end of the day (1440):
free_agenda1([(_, EndTime, _)], [(FreeFrom, 1440)]) :- 
    EndTime \== 1440, !,
    FreeFrom is EndTime + 1.

% If the last scheduled surgery ends exactly at the end of the day:
free_agenda1([(_, _, _)], []).

% If two surgeries are scheduled back-to-back without any gap:
free_agenda1([(_, EndTime, _), (NextStartTime, NextEndTime, _) | RemainingSchedule], FreeSlots) :-
    NextSlotStart is EndTime + 1,
    NextStartTime == NextSlotStart, !,
    free_agenda1([(NextStartTime, NextEndTime, _) | RemainingSchedule], FreeSlots).

% If two surgeries are not back-to-back and there's a gap between them:
free_agenda1([(_, EndTime, _), (NextStartTime, NextEndTime, _) | RemainingSchedule], [(FreeFrom, FreeUntil) | FreeSlots]) :-
    FreeFrom is EndTime + 1,
    FreeUntil is NextStartTime - 1,
    free_agenda1([(NextStartTime, NextEndTime, _) | RemainingSchedule], FreeSlots).



% Receives FreeSlots output in agenda0 or 1 and trimms to match working hours
adapt_timetable(StaffId, Date, FreeIntervals, AdjustedIntervals) :-
    timetable(StaffId, Date, (WorkStart, WorkEnd)),
    treatin(WorkStart, FreeIntervals, AdjustedStartIntervals),
    treatfin(WorkEnd, AdjustedStartIntervals, AdjustedIntervals).
    

% Adjusts the free intervals to start after the given start time (WorkStart).

% Case 1: The first free interval starts after or exactly at the work start time.
treatin(WorkStart, [(IntervalStart, IntervalEnd) | FreeIntervals], [(IntervalStart, IntervalEnd) | FreeIntervals]) :-
    WorkStart =< IntervalStart, !.

% Case 2: The free interval ends before the work start time, skip this interval.
treatin(WorkStart, [(_, IntervalEnd) | FreeIntervals], AdjustedIntervals) :-
    WorkStart > IntervalEnd, !,
    treatin(WorkStart, FreeIntervals, AdjustedIntervals).

% Case 3: Adjust the first interval to start at the work start time.
treatin(WorkStart, [(_, IntervalEnd) | FreeIntervals], [(WorkStart, IntervalEnd) | FreeIntervals]).

% Base Case: If no intervals are left, return an empty list.
treatin(_, [], []).


% Adjusts the free intervals to end before the given end time (WorkEnd).
% Case 1: The current interval ends before or exactly at the work end time.
treatfin(WorkEnd, [(IntervalStart, IntervalEnd) | FreeIntervals], [(IntervalStart, IntervalEnd) | AdjustedIntervals]) :-
    WorkEnd >= IntervalEnd, !,
    treatfin(WorkEnd, FreeIntervals, AdjustedIntervals).

% Case 2: The current interval starts after the work end time, discard it.
treatfin(WorkEnd, [(IntervalStart, _) | _], []) :-
    WorkEnd < IntervalStart, !.

% Case 3: Adjust the current interval to end at the work end time.
treatfin(WorkEnd, [(IntervalStart, _) | _], [(IntervalStart, WorkEnd)]).

% Base Case: If no intervals are left, return an empty list.
treatfin(_, [], []).




% Base case: If there's only one name, simply retrieve its availability.
intersect_all_agendas([Person], Date, AvailabilityList) :- 
    !, 
    availability(Person, Date, AvailabilityList).

% Recursive case: Intersect the availability of multiple people.
intersect_all_agendas([Person | RemainingPeople], Date, IntersectionList) :-
    availability(Person, Date, PersonAvailability),
    intersect_all_agendas(RemainingPeople, Date, RemainingAvailability),
    intersect_2_agendas(PersonAvailability, RemainingAvailability, IntersectionList).


% Base case: If one of the lists is empty, the intersection is empty.
intersect_2_agendas([], _, []).

intersect_2_agendas([Interval | RemainingIntervals], AvailabilityList, IntersectionList) :- 
    intersect_availability(Interval, AvailabilityList, CurrentIntersection, RemainingAvailability),
    intersect_2_agendas(RemainingIntervals, RemainingAvailability, NextIntersection),
    append(CurrentIntersection, NextIntersection, IntersectionList).


% Base case: If the second list is empty, there are no intersections.
intersect_availability((_, _), [], [], []).

% Case 1: If the current interval ends before the next available interval starts, there is no overlap.
intersect_availability((_, End), [(NextStart, NextEnd) | Remaining], [], [(NextStart, NextEnd) | Remaining]) :-
    End < NextStart, !.

% Case 2: If the current interval starts after the next available interval ends, continue checking.
intersect_availability((Start, End), [(_, NextEnd) | Remaining], Intersection, UpdatedAvailability) :-
    Start > NextEnd, !,
    intersect_availability((Start, End), Remaining, Intersection, UpdatedAvailability).

% Case 3: If the current interval partially overlaps with the next available interval.
intersect_availability((Start, End), [(NextStart, NextEnd) | Remaining], [(OverlapStart, OverlapEnd)], [(End, NextEnd) | Remaining]) :-
    NextEnd > End, !,
    min_max(Start, NextStart, _, OverlapStart),
    min_max(End, NextEnd, OverlapEnd, _).

% Case 4: If the current interval fully overlaps the next available interval.
intersect_availability((Start, End), [(NextStart, NextEnd) | Remaining], [(OverlapStart, OverlapEnd) | Intersections], UpdatedAvailability) :-
    End >= NextEnd, !,
    min_max(Start, NextStart, _, OverlapStart),
    min_max(End, NextEnd, OverlapEnd, _),
    intersect_availability((NextEnd, End), Remaining, Intersections, UpdatedAvailability).


min_max(Value1, Value2, MinValue, MaxValue) :- 
    Value1 < Value2, !, 
    MinValue = Value1, 
    MaxValue = Value2.

min_max(Value1, Value2, MinValue, MaxValue) :- 
    MinValue = Value2, 
    MaxValue = Value1.
    




schedule_all_surgeries(Room, Day) :-
    % Clear all previously stored data for agendas and availability
    retractall(agenda_staff1(_, _, _)),
    retractall(agenda_operation_room1(_, _, _)),
    retractall(availability(_, _, _)),

    % Copy staff agendas into temporary storage
    findall(_, (
        agenda_staff(StaffId, Day, StaffAgenda),
        assertz(agenda_staff1(StaffId, Day, StaffAgenda))
    ), _),

    % Copy the room agenda into temporary storage
    agenda_operation_room(RoomId, Date, RoomAgenda),
    assertz(agenda_operation_room1(RoomId, Date, RoomAgenda)),

    % Generate availability intervals for each staff member
    findall(_, (
        agenda_staff1(StaffId, Date, OriginalAgenda),
        free_agenda0(OriginalAgenda, FreeSlots),
        % Uses the FreeSlots from free_agenda0 to adapt the timetable to working hours
        adapt_timetable(StaffId, Date, FreeSlots, AdjustedSlots),
        % Populates availability facts with the adjusted slots
        assertz(availability(StaffId, Date, AdjustedSlots))
    ), _),

    % Get the list of all surgery codes
    findall(SurgeryId, surgery_id(SurgeryId, _), SurgeryList),

    % Schedule all surgeries based on the availability of rooms and staff
    availability_all_surgeries(SurgeryList, Room, Day),
    !.
    
    

% Base case: If there are no surgeries left to schedule.
availability_all_surgeries([], _, _).

% Recursive case: Schedule surgeries one by one.
availability_all_surgeries([SurgeryId | RemainingSurgeries], Room, Day) :-
    % Get the surgery type and its duration
    surgery_id(SurgeryId, SurgeryType),
    surgery(SurgeryType, _, SurgeryDuration, _),
    % surgery(SurgeryType, SurgeryPhase1, SurgeryPhase2, SurgeryPhase3),

    % SurgeryDuration is SurgeryPhase1 + SurgeryPhase2 + SurgeryPhase3,

    % Find possible time slots and required doctors for the surgery
    availability_operation(SurgeryId, Room, Day, AvailableSlots, RequiredStaff),

    % Schedule the surgery in the first available time slot
    schedule_first_interval(SurgeryDuration, AvailableSlots, (StartTime, EndTime)),

    % Update the room's agenda with the scheduled surgery
    retract(agenda_operation_room1(Room, Day, CurrentAgenda)),
    insert_agenda((StartTime, EndTime, SurgeryId), CurrentAgenda, UpdatedAgenda),
    assertz(agenda_operation_room1(Room, Day, UpdatedAgenda)),

    % Update the schedules of the involved doctors
    insert_agenda_staff((StartTime, EndTime, SurgeryId), Day, RequiredStaff),

    % Recursively schedule the remaining surgeries
    availability_all_surgeries(RemainingSurgeries, Room, Day).



% Find the available time slots for a surgery in a specific room on a given day.
availability_operation(SurgeryId, Room, Day, PossibleSlots, RequiredStaff) :-
    surgery_id(SurgeryId, SurgeryType),
    surgery(SurgeryType, _, SurgeryDuration, _),
    % surgery(SurgeryType, SurgeryPhase1, SurgeryPhase2, SurgeryPhase3),

    % SurgeryDuration is SurgeryPhase1 + SurgeryPhase2 + SurgeryPhase3,

    % Get the list of staff assigned to this surgery
    findall(Staff, assignment_surgery(SurgeryId, Staff), RequiredStaff),

    % Find the intersection of all staff' schedules for the given day
    intersect_all_agendas(RequiredStaff, Day, StaffAgendas),

    % Get the current room's schedule
    agenda_operation_room1(Room, Day, RoomAgenda),

    % Get the free slots in the room's agenda
    free_agenda0(RoomAgenda, FreeRoomSlots),

    % Find the intersection of doctors' and room's available time slots
    intersect_2_agendas(StaffAgendas, FreeRoomSlots, IntersectionSlots),

    % Remove intervals that are too short for the surgery
    remove_unf_intervals(SurgeryDuration, IntersectionSlots, PossibleSlots).

% Remove intervals that are shorter than the surgery duration

% Base case: If there are no intervals left, return an empty list.
remove_unf_intervals(_, [], []).

% Case 1: If the current interval is long enough, keep it.
remove_unf_intervals(MinDuration, [(StartTime, EndTime) | RemainingIntervals], [(StartTime, EndTime) | ValidIntervals]) :-
    Duration is EndTime - StartTime + 1,
    MinDuration =< Duration, 
    !,
    remove_unf_intervals(MinDuration, RemainingIntervals, ValidIntervals).

% Case 2: If the current interval is too short, discard it.
remove_unf_intervals(MinDuration, [_ | RemainingIntervals], ValidIntervals) :-
    remove_unf_intervals(MinDuration, RemainingIntervals, ValidIntervals).

% Schedule the first interval that fits the surgery duration
schedule_first_interval(SurgeryDuration, [(SlotStart, _) | _], (SlotStart, SlotEnd)) :-
    SlotEnd is SlotStart + SurgeryDuration - 1.
    
% Inserting a surgery schedule into the agenda sorted by start time.
% Handles the base case where there are no scheduled yet.
insert_agenda((StartTime, EndTime, SurgeryId), [], [(StartTime, EndTime, SurgeryId)]).

% Inserting a surgery schedule into the agenda on the left position by comparing if it ends before the next scheduled event starts.
insert_agenda((StartTime, EndTime, SurgeryId), [(SlotStart, SlotEnd, AssignedSurgery) | RemainingAgenda], [(StartTime, EndTime, SurgeryId), (SlotStart, SlotEnd, AssignedSurgery) | RemainingAgenda]) :-
    EndTime < SlotStart, !.

% Recursive call to insert the surgery schedule in the correct position, basically going through the list until it calls the previous clause.
insert_agenda((StartTime, EndTime, SurgeryId), [(SlotStart, SlotEnd, AssignedSurgery) | RemainingAgenda], [(SlotStart, SlotEnd, AssignedSurgery) | UpdatedAgenda]) :-
    insert_agenda((StartTime, EndTime, SurgeryId), RemainingAgenda, UpdatedAgenda).

% Inserting a surgery schedule into multiple staff agendas.

% Base case: If there are no staff members left to update.
insert_agenda_staff(_, _, []).

% Update the schedule of all staff members involved in the surgery, one by one recursively by adding it to the first one in the list.
insert_agenda_staff((StartTime, EndTime, SurgeryId), Day, [Staff | RemainingStaffs]) :-
    retract(agenda_staff1(Staff, Day, CurrentAgenda)),
    insert_agenda((StartTime, EndTime, SurgeryId), CurrentAgenda, UpdatedAgenda),
    assert(agenda_staff1(Staff, Day, UpdatedAgenda)),
    insert_agenda_staff((StartTime, EndTime, SurgeryId), Day, RemainingStaffs).



% Schedule surgeries prioritizing the most occupied doctor.
schedule_highest_occupancy(Room, Day) :-
    % Clear all previously stored data for agendas and availability
    retractall(agenda_staff1(_, _, _)),
    retractall(agenda_operation_room1(_, _, _)),
    retractall(availability(_, _, _)),

    % Copy staff agendas into temporary storage
    findall(_, (
        agenda_staff(StaffId, Day, StaffAgenda),
        assertz(agenda_staff1(StaffId, Day, StaffAgenda))
    ), _),

    % Copy the room agenda into temporary storage
    agenda_operation_room(RoomId, Date, RoomAgenda),
    assertz(agenda_operation_room1(RoomId, Date, RoomAgenda)),

    % Generate availability intervals for each staff member
    findall(_, (
        agenda_staff1(StaffId, Date, OriginalAgenda),
        free_agenda0(OriginalAgenda, FreeSlots),
        adapt_timetable(StaffId, Date, FreeSlots, AdjustedSlots),
        assertz(availability(StaffId, Date, AdjustedSlots))
    ), _),

    % Get the list of all surgery codes
    findall(SurgeryId, surgery_id(SurgeryId, _), SurgeryList),

    % Start scheduling surgeries step by step
    schedule_surgeries_by_occupancy(SurgeryList, Room, Day),
    !.

% Schedule surgeries prioritizing most occupied doctors
schedule_surgeries_by_occupancy([], _, _) :- !.
schedule_surgeries_by_occupancy(SurgeryList, Room, Day) :-
    % Debug output
    format('Scheduling surgeries: ~w~n', [SurgeryList]),
    
    % Calculate doctor occupancies
    calculate_doctor_occupancy(SurgeryList, Day, DoctorOccupancies),
    format('Doctor occupancies: ~w~n', [DoctorOccupancies]),
    
    % Get most critical doctor
    select_highest_occupancy_doctor(DoctorOccupancies, MostCriticalDoctor),
    format('Selected doctor: ~w~n', [MostCriticalDoctor]),
    
    % Get next surgery for this doctor
    findall(SurgeryId, (
        member(SurgeryId, SurgeryList),
        assignment_surgery(SurgeryId, MostCriticalDoctor)
    ), DoctorSurgeries),
    
    % Schedule first available surgery
    (DoctorSurgeries = [SelectedSurgery|_] ->
        % Get surgery details
        surgery_id(SelectedSurgery, SurgeryType),
        surgery(SurgeryType, Anesthesia, Duration, Cleaning),
        %TotalDuration is Anesthesia + Duration + Cleaning,
        TotalDuration is Duration,
        
        % Find available slot
        availability_operation(SelectedSurgery, Room, Day, PossibleSlots, RequiredStaff),
        
        % Schedule in first available slot
        (PossibleSlots = [(StartTime,_)|_] ->
            EndTime is StartTime + TotalDuration - 1,
            
            % Update room agenda
            retract(agenda_operation_room1(Room, Day, CurrentRoomAgenda)),
            insert_agenda((StartTime, EndTime, SelectedSurgery), 
                         CurrentRoomAgenda, 
                         UpdatedRoomAgenda),
            assertz(agenda_operation_room1(Room, Day, UpdatedRoomAgenda)),
            
            % Update staff agendas
            insert_agenda_staff((StartTime, EndTime, SelectedSurgery), 
                              Day, 
                              RequiredStaff),
            
            % Remove scheduled surgery and continue
            delete(SurgeryList, SelectedSurgery, RemainingList),
            schedule_surgeries_by_occupancy(RemainingList, Room, Day)
        ;
            % No slots available, try next surgery
            delete(SurgeryList, SelectedSurgery, RemainingList),
            schedule_surgeries_by_occupancy(RemainingList, Room, Day)
        )
    ;
        % No surgeries for this doctor, done
        true
    ).

% Calculate doctor occupancy percentages
calculate_doctor_occupancy(SurgeryList, Day, DoctorOccupancies) :-
    % Get all unique doctors
    findall(Doctor, (
        member(Surgery, SurgeryList),
        assignment_surgery(Surgery, Doctor)
    ), AllDoctors),
    sort(AllDoctors, UniqueDoctors),
    
    % Calculate occupancy for each
    findall((Doctor, Occupancy), (
        member(Doctor, UniqueDoctors),
        calculate_surgery_time(Doctor, SurgeryList, SurgeryTime),
        calculate_free_time(Doctor, Day, FreeTime),
        (FreeTime > 0 -> 
            Occupancy is (SurgeryTime / FreeTime) * 100
        ;
            Occupancy = 0
        )
    ), DoctorOccupancies).

% Calculate the total surgery time for a given doctor.
calculate_surgery_time(Doctor, SurgeryList, TotalSurgeryTime) :-
    findall(Duration, (
        member(SurgeryId, SurgeryList),
        assignment_surgery(SurgeryId, Doctor),
        surgery_id(SurgeryId, SurgeryType),
        surgery(SurgeryType, _, Duration, _)
    ), Durations),
    sum_list(Durations, TotalSurgeryTime).

% Calculate the total free time for a given doctor.
calculate_free_time(Doctor, Day, TotalFreeTime) :-
    availability(Doctor, Day, FreeSlots),
    findall(Duration, (
        member((Start, End), FreeSlots),
        Duration is End - Start + 1
    ), Durations),
    sum_list(Durations, TotalFreeTime).

% Select the doctor with the highest occupancy percentage.
select_highest_occupancy_doctor(DoctorOccupancies, MostCriticalDoctor) :-
    max_member((MostCriticalDoctor, _), DoctorOccupancies).

% Select the next surgery for the given doctor.
select_next_surgery(Doctor, SurgeryList, SelectedSurgery) :-
    % Filter surgeries assigned to the given doctor
    findall(SurgeryId, (
        member(SurgeryId, SurgeryList),
        assignment_surgery(SurgeryId, Doctor)
    ), DoctorSurgeries),
    % Pick the first surgery in the list
    nth0(0, DoctorSurgeries, SelectedSurgery).


% This uses Heuristic based on earlist available
% Obtain the best solution for a given room and day.
obtain_better_sol(Room, Day, BestRoomSchedule, BestStaffSchedules, FinalEndTime) :-
    get_time(StartTime),
    retractall(iteration_counter(_)),
    asserta(iteration_counter(0)),
    (obtain_better_sol1(Room, Day); true),
    retract(better_sol(Day, Room, BestRoomSchedule, BestStaffSchedules, FinalEndTime)),

    % Calculate the time taken to find the solution
    get_time(EndTime),
    TimeTaken is EndTime - StartTime.

% Find a better (not the best) solution for the given room and day.
obtain_better_sol1(Room, Day) :-

    % Get the list of all surgery codes
    asserta(better_sol(Day, Room, _, _, 1441)),
    findall(SurgeryId, surgery_id(SurgeryId, _), AllSurgeryIds), !,
    % Generate all possible permutations of the surgeries
    permutation(AllSurgeryIds, SurgeryIdList),

    % Clear all previously stored data for agendas and availability
    retractall(agenda_staff1(_, _, _)),
    retractall(agenda_operation_room1(_, _, _)),
    retractall(availability(_, _, _)),

    % Load the staff agendas for the day
    findall(_, (
        agenda_staff(StaffId, Day, StaffAgenda),
        assertz(agenda_staff1(StaffId, Day, StaffAgenda))
    ), _),

    % Load the room agenda for the day
    agenda_operation_room(Room, Day, RoomAgenda),
    assert(agenda_operation_room1(Room, Day, RoomAgenda)),

    % Adjust and store availability for each staff member
    findall(_, (
        agenda_staff1(StaffId, Day, StaffAgenda),
        free_agenda0(StaffAgenda, FreeSlots),
        adapt_timetable(StaffId, Day, FreeSlots, AdjustedSlots),
        assertz(availability(StaffId, Day, AdjustedSlots))
    ), _),

    % Schedule surgeries based on availability
    availability_all_surgeries(SurgeryIdList, Room, Day),

    % Get the updated room agenda after scheduling
    agenda_operation_room1(Room, Day, UpdatedRoomAgenda),

    % Update the best solution if necessary
    update_better_sol(Day, Room, UpdatedRoomAgenda, SurgeryIdList),

    % Continue the search for better solutions
    fail.

% Update the best solution if the new solution is better than the current best solution.
update_better_sol(Day, Room, RoomAgenda, SurgeryIdList) :-
    increment_counter,
    better_sol(Day, Room, _, _, CurrentEndTime),
    reverse(RoomAgenda, ReversedRoomAgenda),

    % Evaluate the final time of the current solution
    evaluate_final_time(ReversedRoomAgenda, SurgeryIdList, NewEndTime),

    % Print debugging information
    % write('Analysing for SurgeryIdList='), write(SurgeryIdList), nl,
    % write('Now: NewEndTime='), write(NewEndTime), write(' RoomAgenda='), write(RoomAgenda), nl,

    % If the new solution is better, update the solution
    NewEndTime < CurrentEndTime,
    % write('Best solution updated'), nl,

    % Retract the old solution and store the new one
    retract(better_sol(_, _, _, _, _)),
    findall(Staff, assignment_surgery(_, Staff), AllStaff),
    remove_equals(AllStaff, StaffList),

    % Get the agendas of the staff members
    list_doctors_agenda(Day, StaffList, StaffAgendas),

    % Assert the new best solution
    asserta(better_sol(Day, Room, RoomAgenda, StaffAgendas, NewEndTime)).

% Evaluate the final time of a solution based on the scheduled surgeries.
% Base case: If there are no more surgeries left, return the end time of the day.
evaluate_final_time([], _, 1441).

% If the current surgery is in the list of surgeries, return its end time.
evaluate_final_time([(_, EndTime, SurgeryId) | _], SurgeryIdList, EndTime) :-
    member(SurgeryId, SurgeryIdList), !.

% If the current surgery is not the one we looking at, continue evaluating the remaining surgeries.
evaluate_final_time([_ | RemainingAgenda], SurgeryIdList, EndTime) :-
    evaluate_final_time(RemainingAgenda, SurgeryIdList, EndTime).

% List the agendas of all doctors for a given day.

% Base case: If there are no doctors left, return an empty list.
list_doctors_agenda(_, [], []).

% List the agendas of all doctors for a given day.
list_doctors_agenda(Day, [Doctor | RemainingDoctors], [(Doctor, DoctorAgenda) | DoctorAgendas]) :-
    agenda_staff1(Doctor, Day, DoctorAgenda),
    list_doctors_agenda(Day, RemainingDoctors, DoctorAgendas).

% Remove duplicate elements from a list.
% Base case: If there are no elements left, return an empty list.
remove_equals([], []).

% If the current item is already in the list, skip it.
remove_equals([Item | RemainingItems], CleanedList) :-
    member(Item, RemainingItems), !,
    remove_equals(RemainingItems, CleanedList).

% If the current item is not in the list, keep it.
remove_equals([Item | RemainingItems], [Item | CleanedList]) :-
    remove_equals(RemainingItems, CleanedList).


% Initialize and find the best solution using occupancy heuristic
obtain_better_sol_occupancy(Room, Day, BestRoomSchedule, BestStaffSchedules, FinalEndTime) :-
    get_time(StartTime),
    % Initialize
    init_counters,
    retractall(better_sol(_, _, _, _, _)),
    retractall(iteration_counter(_)),
    asserta(better_sol(Day, Room, [], [], 1441)),
    asserta(iteration_counter(0)),
    
    % Single pass using occupancy heuristic 
    obtain_better_sol_occupancy1(Room, Day),
    
    % Get results
    better_sol(Day, Room, BestRoomSchedule, BestStaffSchedules, FinalEndTime),
    iteration_counter(TotalIterations),
    
    get_time(EndTime),
    TimeTaken is EndTime - StartTime.

% Occupancy-based scheduling
obtain_better_sol_occupancy1(Room, Day) :-
    increment_counter,
    % Clear state
    retractall(agenda_staff1(_, _, _)),
    retractall(agenda_operation_room1(_, _, _)),
    retractall(availability(_, _, _)),
    
    % Initialize room
    assertz(agenda_operation_room1(Room, Day, [])),
    
    % Initialize staff
    findall(_, (
        agenda_staff(StaffId, Day, Agenda),
        assertz(agenda_staff1(StaffId, Day, Agenda))
    ), _),
    
    % Calculate availabilities
    findall(_, (
        agenda_staff1(StaffId, Day, Agenda),
        free_agenda0(Agenda, FreeSlots),
        adapt_timetable(StaffId, Day, FreeSlots, AdjustedSlots),
        assertz(availability(StaffId, Day, AdjustedSlots))
    ), _),
    
    % Get surgeries
    findall(SurgeryId, surgery_id(SurgeryId, _), AllSurgeries),
    
    % Schedule using occupancy heuristic
    schedule_by_occupancy(AllSurgeries, Room, Day),
    
    % Get final schedule
    agenda_operation_room1(Room, Day, FinalRoomAgenda),
    findall((StaffId, StaffAgenda), 
            agenda_staff1(StaffId, Day, StaffAgenda), 
            FinalStaffAgendas),
    
    % Update if better
    better_sol(Day, Room, _, _, CurrentEndTime),
    evaluate_final_time(FinalRoomAgenda, AllSurgeries, NewEndTime),
    (NewEndTime < CurrentEndTime ->
        retractall(better_sol(Day, Room, _, _, _)),
        assertz(better_sol(Day, Room, FinalRoomAgenda, FinalStaffAgendas, NewEndTime))
    ;
        true
    ).

% Schedule surgeries based on doctor occupancy 
schedule_by_occupancy([], _, _) :- !.

schedule_by_occupancy(Surgeries, Room, Day) :-
    % Get and increment iteration count
    catch(nb_getval(iteration_count, Count), 
          error(existence_error(variable, iteration_count), _), 
          (nb_setval(iteration_count, 0), Count = 0)),
    
    (Count > 5000 -> 
        format('Exceeded maximum iterations. Remaining surgeries: ~w~n', [Surgeries]),
        fail
    ;
        Count1 is Count + 1,
        nb_setval(iteration_count, Count1)
    ),

    % Rest of the predicate remains the same
    calculate_doctor_occupancy(Surgeries, Day, Occupancies),
    
    
    % Select highest occupancy doctor
    (Occupancies = [] ->
        format('Failed: No available doctors for surgeries: ~w~n', [Surgeries]),
        fail
    ;
        findall(Occ-Doc, member((Doc,Occ), Occupancies), Pairs),
        keysort(Pairs, Sorted),
        reverse(Sorted, [_-MostOccupiedDoc|_]),
        
        % Get surgeries for this doctor
        findall(Surgery, (
            member(Surgery, Surgeries),
            assignment_surgery(Surgery, MostOccupiedDoc)
        ), DocSurgeries),
        
        % Try to schedule
        (DocSurgeries = [] ->
            format('No surgeries available for doctor ~w~n', [MostOccupiedDoc]),
            % Remove this doctor and try others
            delete(Occupancies, (MostOccupiedDoc,_), RemainingOcc),
            schedule_by_occupancy(Surgeries, Room, Day)
        ;
            [Surgery|_] = DocSurgeries,
            (schedule_surgery(Surgery, Room, Day) ->
                % Success - continue with remaining
                % format('Successfully scheduled surgery ~w~n', [Surgery]),
                delete(Surgeries, Surgery, RemainingSurgeries),
                schedule_by_occupancy(RemainingSurgeries, Room, Day)
            ;
                % Failed - try next surgery
                % format('Failed to schedule surgery ~w~n', [Surgery]),
                delete(DocSurgeries, Surgery, RemainingDocSurgeries),
                (RemainingDocSurgeries = [] ->
                    format('No more surgeries to try for doctor ~w~n', [MostOccupiedDoc]),
                    fail
                ;
                    schedule_by_occupancy(Surgeries, Room, Day)
                )
            )
        )
    ).

:- nb_setval(iteration_count, 0).

% Schedule a single surgery with failure handling
schedule_surgery(SurgeryId, Room, Day) :-
    % Get surgery details
    surgery_id(SurgeryId, SurgeryType),
    surgery(SurgeryType, Anesthesia, Duration, Cleaning),
    TotalDuration is Anesthesia + Duration + Cleaning,
    
    % Find available slot
    availability_operation(SurgeryId, Room, Day, PossibleSlots, RequiredStaff),
    
    % Check if slots available
    PossibleSlots \= [],
    PossibleSlots = [(StartTime,_)|_],
    EndTime is StartTime + TotalDuration - 1,
    
    % Update room agenda
    retract(agenda_operation_room1(Room, Day, CurrentRoomAgenda)),
    insert_agenda((StartTime, EndTime, SurgeryId), 
                 CurrentRoomAgenda, 
                 UpdatedRoomAgenda),
    assertz(agenda_operation_room1(Room, Day, UpdatedRoomAgenda)),
    
    % Update staff agendas
    insert_agenda_staff((StartTime, EndTime, SurgeryId), 
                       Day,
                       RequiredStaff).
    
    % format('Scheduled surgery ~w from ~w to ~w~n', [SurgeryId, StartTime, EndTime]).

:- discontiguous schedule_surgery/3.

% Evaluation function for scheduling surgeries
evaluate_scheduling(Surgeries, Room, Day) :-
    % Initialize iteration counter
    nb_setval(iteration_count, 0),
    
    % Start scheduling
    % format('Starting to schedule surgeries...~n')
    schedule_by_occupancy(Surgeries, Room, Day),
    
    % Collect results
    nb_getval(iteration_count, Count),
    % format('Total iterations: ~w~n', [Count]),
    
    % Analyze success rate
    findall(Surgery, (member(Surgery, Surgeries), scheduled(Surgery)), ScheduledSurgeries),
    length(ScheduledSurgeries, Successful),
    length(Surgeries, Total),
    Failed is Total - Successful.
    
    % format('Successfully scheduled ~w out of ~w surgeries.~n', [Successful, Total]),
    % format('Failed surgeries: ~w~n', [Failed]).
    
% Helper predicate to track scheduled surgeries
scheduled(SurgeryId) :-
    agenda_operation_room1(_, _, RoomAgenda),
    member((_, _, SurgeryId), RoomAgenda).

% Track unsuccessful surgery scheduling attempts
schedule_surgery(SurgeryId, Room, Day) :-
    % Original scheduling logic
    (original_schedule_surgery(SurgeryId, Room, Day) -> 
        assertz(scheduled(SurgeryId));
        format('Scheduling failed for surgery ~w~n', [SurgeryId])
    ).

% Original surgery scheduling logic (your existing schedule_surgery logic)
original_schedule_surgery(SurgeryId, Room, Day) :-
    surgery_id(SurgeryId, SurgeryType),
    surgery(SurgeryType, Anesthesia, Duration, Cleaning),
    TotalDuration is Anesthesia + Duration + Cleaning,
    
    % Find available slot
    availability_operation(SurgeryId, Room, Day, PossibleSlots, RequiredStaff),
    
    % Check if slots available
    PossibleSlots \= [],
    PossibleSlots = [(StartTime, _) | _],
    EndTime is StartTime + TotalDuration - 1,
    
    % Update room agenda
    retract(agenda_operation_room1(Room, Day, CurrentRoomAgenda)),
    insert_agenda((StartTime, EndTime, SurgeryId), 
                 CurrentRoomAgenda, 
                 UpdatedRoomAgenda),
    assertz(agenda_operation_room1(Room, Day, UpdatedRoomAgenda)),
    
    % Update staff agendas
    insert_agenda_staff((StartTime, EndTime, SurgeryId), 
                       Day,
                       RequiredStaff).
    
    % format('Scheduled surgery ~w from ~w to ~w~n', [SurgeryId, StartTime, EndTime]).
