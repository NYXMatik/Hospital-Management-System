:- module(server, [
    server/1,
    handle_schedule_occupancy/1, 
    handle_schedule_normal/1
]).

% Load all required libraries first
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_cors)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/json)).

% Load application modules
:- use_module(scheduler, [
    obtain_better_sol_occupancy/5,
    obtain_better_sol/5
]).

% Then declare dynamics
:- dynamic generations/1.
:- dynamic population/1.
:- dynamic prob_crossover/1.
:- dynamic prob_mutation/1.
:- dynamic max_time/1.
:- dynamic num_genes/1.

% Server startup
server(Port) :-
    http_server(http_dispatch, [port(Port)]).

% CORS configuration
:- http_handler('/', handle_cors, [methods([options])]).
:- set_setting(http:cors, [*]).

% Define routes
:- http_handler('/api/schedule/occupancy', handle_schedule_occupancy, []).
:- http_handler('/api/schedule/normal', handle_schedule_normal, []).


% CORS handler
handle_cors(Request) :-
    cors_enable(Request, [
        methods([get,post,delete,put,options]),
        headers(['Content-Type'])
    ]).

% Modify handle_schedule_occupancy to properly handle HTTP request
handle_schedule_occupancy(Request) :-
    cors_enable(Request, [methods([get])]),
    (catch(
        % Try to get parameters from request
        http_parameters(Request, [
            room(Room, [default(or1)]),
            date(Date, [default(20241028)])
        ]),
        _, 
        % If parameters fail, use defaults
        (Room = or1, Date = 20241028)
    )),
    % Call scheduling with occupancy optimization
    obtain_better_sol_occupancy(Room, Date, RoomSchedule, StaffSchedules, EndTime),
    % Convert to JSON
    prolog_to_json(RoomSchedule, JsonRoomSchedule),
    prolog_to_json(StaffSchedules, JsonStaffSchedules),
    % Send response
    reply_json_dict(_{
        status: success,
        roomSchedule: JsonRoomSchedule,
        staffSchedules: JsonStaffSchedules,
        endTime: EndTime
    }).

% Add error handling for schedule handler
handle_schedule_occupancy(Request) :-
    cors_enable(Request, [methods([get])]),
    reply_json_dict(_{
        status: error,
        message: 'Failed to generate schedule'
    }).

handle_schedule_normal(Request) :-
    cors_enable(Request, [methods([get])]),
    (catch(
        http_parameters(Request, [
            room(Room, [default(or1)]),
            date(Date, [default(20241028)])
        ]),
        _,
        (Room = or1, Date = 20241028)
    )),
    obtain_better_sol(or1, 20241028, RoomSchedule, StaffSchedules, EndTime),
    prolog_to_json(RoomSchedule, JsonRoomSchedule),
    prolog_to_json(StaffSchedules, JsonStaffSchedules),
    reply_json_dict(_{
        status: success,
        roomSchedule: JsonRoomSchedule,
        staffSchedules: JsonStaffSchedules,
        endTime: EndTime
    }).

handle_schedule_normal(Request) :-
    cors_enable(Request, [methods([get])]),
    reply_json_dict(_{
        status: error,
        message: 'Failed to generate schedule'
    }).

% Add new JSON conversion rules

% Convert Prolog terms to JSON-compatible format
prolog_to_json(PrologList, JsonList) :-
    maplist(term_to_json, PrologList, JsonList).

term_to_json((Surgery-Room), _{surgery:Surgery, room:Room}) :- !.
term_to_json(Value*Score, _{value:JsonValue, score:Score}) :-
    prolog_to_json(Value, JsonValue), !.

term_to_json((Start, End, Id), _{start:Start, end:End, id:Id}) :- !.
term_to_json((Staff, Schedule), _{staff:Staff, schedule:JsonSchedule}) :-
    maplist(term_to_json, Schedule, JsonSchedule), !.
term_to_json(Term, Term).

% Start server (default port 8000)
:- server(8000).