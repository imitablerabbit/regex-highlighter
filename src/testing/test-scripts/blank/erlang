-module(ring).
-export([]).

-compile(export_all).

% create_ring will return the data structure which is used
% for all of the ring functions. This is essentially a list of
% Pid's for processes which have already been spawned and are
% waiting for a message from the previous process in the ring.
create_ring(0) -> [];
create_ring(N) -> 
	[spawn(ring, ring_element, []) | create_ring(N-1)].

% ring_element will handle the passing of a message to the 
% next process in the ring. This happens until the message
% reaches the end of the ring.
ring_element() -> 
	receive 
		{From, {N, Ring, Message, Iter}} when N =< length(Ring) ->
			Pid = lists:nth(N, Ring),
			Pid ! {From, {N+1, Ring, Message, Iter}},
			ring_element();
		{From, {N, Ring, Message, Iter}} when N > length(Ring) ->
			if 
				Iter > 0 ->
					Pid = hd(Ring),
					Pid ! {From, {2, Ring, Message, Iter-1}},
					ring_element();
				Iter =:= 0 ->
					Pid = lists:nth(length(Ring), Ring),
					From ! {Pid, Message},
					ring_element()
			end
	end.

% send_message will send a message to all of the processes
% in the ring. It will start with the head of the ring and
% leave it up to the ring to terminate.
send_message(Ring, Message, Iter) ->
	hd(Ring) ! {self(), {2, Ring, Message, Iter}},
	receive
		{Pid, Message} ->
			{Pid, Message}
	end.
