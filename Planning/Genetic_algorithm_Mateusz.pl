:- dynamic generations/1.
:- dynamic population/1.
:- dynamic prob_crossover/1.
:- dynamic prob_mutation/1.
:- dynamic max_time/1.
:- dynamic num_genes/1.
:- dynamic surgeries/1.
:- dynamic rooms/1.

% surgery(Id, Duration, Priority).
surgery(s1, 2, 5).
surgery(s2, 4, 8).
surgery(s3, 1, 3).
surgery(s4, 3, 7).
surgery(s5, 5, 10).

% operating_room(Id).
operating_room(or1).
operating_room(or2).
operating_room(or3).

% Define number of surgeries and rooms
surgeries(5).
rooms(3).

% Initialization of parameters (US 7.3.2)
initialize :-
    prompt_number('Number of new generations: ', NG),
    (retract(generations(_)); true), asserta(generations(NG)),
    prompt_number('Population size: ', PS),
    (retract(population(_)); true), asserta(population(PS)),
    prompt_number('Probability of crossover (%): ', P1),
    PC is P1 / 100,
    (retract(prob_crossover(_)); true), asserta(prob_crossover(PC)),
    prompt_number('Probability of mutation (%): ', P2),
    PM is P2 / 100,
    (retract(prob_mutation(_)); true), asserta(prob_mutation(PM)),
    prompt_number('Maximum time for solution (seconds): ', MaxTime),
    (retract(max_time(_)); true), asserta(max_time(MaxTime)),
    prompt_number('Number of genes: ', NumGenes),
    (retract(num_genes(_)); true), asserta(num_genes(NumGenes)).

prompt_number(Prompt, Number) :-
    repeat,
    write(Prompt), flush_output,
    catch(read_line_to_codes(user_input, Input), _, fail),
    ( Input = [] -> fail ; number_codes(Number, Input), integer(Number) ), !.

% Select scheduling method based on problem dimension and time (US 7.3.4)
select_method(Method) :-
    surgeries(NumSurgeries),
    rooms(NumRooms),
    max_time(MaxTime),
    (NumSurgeries * NumRooms < 20, MaxTime < 10 ->
        Method = generate_all_and_select_better
    ; NumSurgeries * NumRooms < 50, MaxTime < 30 ->
        Method = heuristic
    ;
        Method = genetic_algorithm
    ).

% Generate all and select better (US 7.3.4)
generate_all_and_select_better :-
    write('Using generate all and select better method'), nl,
    findall(Ind, generate_individual(_, _, _, Ind), Population),
    evaluate_population(Population, EvaluatedPopulation),
    order_population(EvaluatedPopulation, OrderedPopulation),
    write('Best solution: '), nl, write(OrderedPopulation), nl.

% Heuristic method (US 7.3.4)
heuristic :-
    write('Using heuristic method'), nl,
    findall(S, surgery(S, _, _), SurgeriesList),
    findall(R, operating_room(R), RoomList),
    heuristic_assign(SurgeriesList, RoomList, Assignment),
    evaluate(Assignment, Score),
    write('Heuristic solution: '), nl, write(Assignment), nl, write('Score: '), write(Score), nl.

heuristic_assign([], _, []).
heuristic_assign([S|RestSurgeries], RoomList, [S-R|RestAssignment]) :-
    random_member(R, RoomList),
    heuristic_assign(RestSurgeries, RoomList, RestAssignment).

% Generate initial population (US 7.3.1)
generate_population(Pop) :-
    population(PopSize),
    surgeries(NumSurgeries),
    findall(S, surgery(S, _, _), SurgeriesList),
    findall(R, operating_room(R), RoomList),
    generate_population(PopSize, SurgeriesList, RoomList, NumSurgeries, Pop).

generate_population(0, _, _, _, []) :- !.
generate_population(PopSize, SurgeriesList, RoomList, NumSurgeries, [Ind|Rest]) :-
    PopSize1 is PopSize - 1,
    generate_population(PopSize1, SurgeriesList, RoomList, NumSurgeries, Rest),
    generate_individual(SurgeriesList, RoomList, NumSurgeries, Ind).

% Generate an individual (assign each surgery to an operating room) (US 7.3.1)
generate_individual([], _, _, []) :- !.
generate_individual([S|RestSurgeries], RoomList, NumSurgeries, [S-R|Rest]) :-
    random_member(R, RoomList),
    generate_individual(RestSurgeries, RoomList, NumSurgeries, Rest).

% Evaluate population (US 7.3.1)
evaluate_population([], []).
evaluate_population([Ind|Rest], [Ind*Score|RestScores]) :-
    evaluate(Ind, Score),
    evaluate_population(Rest, RestScores).

% Evaluate an individual (load balance between rooms) (US 7.3.1)
evaluate(Ind, Score) :-
    findall(R, operating_room(R), RoomList),
    calculate_load(RoomList, Ind, LoadList),
    calculate_balance(LoadList, Score).

% Calculate the load of each room (US 7.3.1)
calculate_load([], _, []).
calculate_load([R|RestRooms], Ind, [Load|RestLoad]) :-
    findall(D, (member(S-R, Ind), surgery(S, D, _)), Durations),
    sum_list(Durations, Load),
    calculate_load(RestRooms, Ind, RestLoad).

% Calculate load balance (lower is better) (US 7.3.1)
calculate_balance(LoadList, Score) :-
    max_list(LoadList, Max),
    min_list(LoadList, Min),
    Score is Max - Min.

% Generate generations (US 7.3.2)
generate :-
    initialize,
    select_method(Method),
    (Method = generate_all_and_select_better -> generate_all_and_select_better
    ; Method = heuristic -> heuristic
    ; Method = genetic_algorithm -> generate_genetic_algorithm
    ).

% Generate genetic algorithm (US 7.3.2)
generate_genetic_algorithm :-
    get_time(StartTime),
    generate_population(Pop),
    write('Initial Population: '), nl, write(Pop), nl,
    evaluate_population(Pop, PopValue),
    write('Evaluated Population: '), nl, write(PopValue), nl,
    order_population(PopValue, PopOrd),
    generations(NG),
    generate_generation(0, NG, PopOrd, StartTime).

% Order population by score (US 7.3.1)
order_population(PopValue, PopValueOrd) :-
    sort(2, @=<, PopValue, PopValueOrd).

% Generation cycle (US 7.3.2)
generate_generation(G, G, Pop, _) :- !,
    write('Final Generation: '), nl, write(Pop), nl.
generate_generation(N, G, Pop, StartTime) :-
    get_time(CurrentTime),
    max_time(MaxTime),
    ElapsedTime is CurrentTime - StartTime,
    (ElapsedTime > MaxTime ->
        write('Time limit reached. Stopping at generation '), write(N), nl, write(Pop), nl
    ;
        write('Generation '), write(N), write(':'), nl, write(Pop), nl,
        crossover(Pop, NewPop1),
        mutation(NewPop1, NewPop),
        evaluate_population(NewPop, NewPopValue),
        order_population(NewPopValue, NewPopOrd),
        N1 is N + 1,
        generate_generation(N1, G, NewPopOrd, StartTime)
    ).

% Crossover (US 7.3.1)
crossover([], []).
crossover([Ind1*_, Ind2*_|Rest], [Child1, Child2|RestChildren]) :-
    prob_crossover(PC), random(0.0, 1.0, P),
    (P =< PC -> Child1 = Ind1, Child2 = Ind2 ; Child1 = Ind1, Child2 = Ind2),
    crossover(Rest, RestChildren).

% Mutation (US 7.3.1)
mutation([], []).
mutation([Ind|Rest], [MutatedInd|RestMutated]) :-
    prob_mutation(PM), random(0.0, 1.0, P),
    (P =< PM -> mutate(Ind, MutatedInd) ; MutatedInd = Ind),
    mutation(Rest, RestMutated).

mutate(Ind, MutatedInd) :-
    random_member(S-R1, Ind),
    random_member(R2, [or1, or2, or3]),
    R1 \= R2,
    select(S-R1, Ind, S-R2, MutatedInd).