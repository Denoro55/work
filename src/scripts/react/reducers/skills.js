const initialSkills = [
	{
		id: 1,
		skill: 'Node'
	},
	{
		id: 2,
		skill: 'Mongo'
	}
]

export default function skills(state=initialSkills,action){
	if (action.type === 'ADD_SKILL'){
		return [...state,action.skill]
	}
	return state
}