
:- dynamic availability/3.
:- dynamic agenda_staff/3.
:- dynamic agenda_staff1/3.
:-dynamic agenda_operation_room/3.
:-dynamic agenda_operation_room1/3.
:-dynamic better_sol/5.

% Time are in minutes of a day so 720 is 12:00 and 1440 is 24:00
% staffCode, date, schedule for the date [(start, end, type of meeting)] - lists are sorted

agenda_staff(d001,20241028,[(720,790,m01),(1080,1140,c01)]).
agenda_staff(d002,20241028,[(850,900,m02),(901,960,m02),(1380,1440,c02)]).
agenda_staff(d003,20241028,[(720,790,m01),(910,980,m02)]).

% staffCode, date, when they work (start, end)

timetable(d001,20241028,(480,1200)).
timetable(d002,20241028,(500,1440)).
timetable(d003,20241028,(520,1320)).

% first example
%agenda_staff(d001,20241028,[(720,840,m01),(1080,1200,c01)]).
%agenda_staff(d002,20241028,[(780,900,m02),(901,960,m02),(1080,1440,c02)]).
%agenda_staff(d003,20241028,[(720,840,m01),(900,960,m02)]).

%timetable(d001,20241028,(480,1200)).
%timetable(d002,20241028,(720,1440)).
%timetable(d003,20241028,(600,1320)).

% staff(staffCode, role, specialization, [list of surgeries they can perform])
staff(d001,doctor,orthopaedist,[so2,so3,so4]).
staff(d002,doctor,orthopaedist,[so2,so3,so4]).
staff(d003,doctor,orthopaedist,[so2,so3,so4]).

%surgery(SurgeryType,TAnesthesia,TSurgery,TCleaning).
surgery(so2,45,60,45).
surgery(so3,45,90,45).
surgery(so4,45,75,45).

% surgery_id(surgery_id ,SurgeryType)
surgery_id(so100001,so2).
surgery_id(so100002,so3).
surgery_id(so100003,so4).
surgery_id(so100004,so2).
surgery_id(so100005,so4).


% assignment_surgery(surgery_id, staffCode)
assignment_surgery(so100001,d001).
assignment_surgery(so100002,d002).
assignment_surgery(so100003,d003).
assignment_surgery(so100004,d001).
assignment_surgery(so100004,d002).
assignment_surgery(so100005,d002).
assignment_surgery(so100005,d003).




% Current schedule for a specific room (roomId, date, schedule for the date [(start, end, surgeryId)] - lists are sorted)
agenda_operation_room(or1, 20241028, [(520, 579, so100000), (1000, 1059, so099999)]).

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


% Obtain the best solution for a given room and day.
obtain_better_sol(Room, Day, BestRoomSchedule, BestStaffSchedules, FinalEndTime) :-
    get_time(StartTime),
    (obtain_better_sol1(Room, Day); true),
    retract(better_sol(Day, Room, BestRoomSchedule, BestStaffSchedules, FinalEndTime)),

    % Output the results
    write('Final Result: BestRoomSchedule='), write(BestRoomSchedule), nl,
    write('BestStaffSchedules='), write(BestStaffSchedules), nl,
    write('FinalEndTime='), write(FinalEndTime), nl,

    % Calculate the time taken to find the solution
    get_time(EndTime),
    TimeTaken is EndTime - StartTime,
    write('Time taken to generate solution: '), write(TimeTaken), nl.

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
    better_sol(Day, Room, _, _, CurrentEndTime),
    reverse(RoomAgenda, ReversedRoomAgenda),

    % Evaluate the final time of the current solution
    evaluate_final_time(ReversedRoomAgenda, SurgeryIdList, NewEndTime),

    % Print debugging information
    write('Analysing for SurgeryIdList='), write(SurgeryIdList), nl,
    write('Now: NewEndTime='), write(NewEndTime), write(' RoomAgenda='), write(RoomAgenda), nl,

    % If the new solution is better, update the solution
    NewEndTime < CurrentEndTime,
    write('Best solution updated'), nl,

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

