<Query Kind="Statements"/>


var currPath = Path.GetDirectoryName(Util.CurrentQueryPath);
var input = File.ReadAllLines($"{currPath}/../inputs/day2.txt").FirstOrDefault().Split(',').Select(i=>int.Parse(i));

int intCodeParser(IEnumerable<int> enumerableState, int noun, int verb)
{
	var state = enumerableState.ToArray();
	int readHead = 0;
	state[1] = noun;
	state[2] = verb;
	while (readHead < state.Count())
	{
		var opCode = state[readHead];
		switch (opCode){
			case 99:
				goto exit_loop;
			case 1:
				state[state[readHead+3]] = state[state[readHead+1]] + state[state[readHead+2]];
				break;
			case 2:
				state[state[readHead + 3]] = state[state[readHead + 1]] * state[state[readHead + 2]];
				break;
			default:
				"Unknown OpCode".Dump();
				goto exit_loop;
		}
		readHead+=4;
	}
	exit_loop: ;
	return state[0];
}

intCodeParser(input, 12, 2).Dump("Part 1");
int? part2()
{
	for (int n = 0; n <= 99; n++)
	{
		for (int v = 0; v <= 99; v++)
		{
			var output = intCodeParser(input, n, v);
			if (output == 19690720)
			{
				return n * 100 + v;
			}
		}
	}
	return null;
}

part2().Dump("Part 2");
