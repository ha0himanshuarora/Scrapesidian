import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";
export enum FlowToExecutionPlanValidationError{"NO_ENTRY_POINT","INVALID_INPUTS"}

type FlowToExecutionPlan = {
    executionPlan?: WorkflowExecutionPlan;
    error?:{
        type:FlowToExecutionPlanValidationError;
        invalidElements?:AppNodeMissingInputs[];
    }
};

export function FlowToExecutionPlan(nodes: AppNode[], edges: Edge[]): FlowToExecutionPlan {
    const entryPoint = nodes.find(node => TaskRegistry[node.data.type].isEntryPoint);
    if (!entryPoint) {
        return{error:{type:FlowToExecutionPlanValidationError.NO_ENTRY_POINT,}}
        }
    const inputsWithErrors:AppNodeMissingInputs[]=[];
    const planned = new Set<string>();

    const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
    if(invalidInputs.length>0){inputsWithErrors.push({
        nodeId:entryPoint.id,inputs:invalidInputs,
    })}

    const executionPlan: WorkflowExecutionPlan = [{
        phase: 1,
        nodes: [entryPoint],
    }];

    planned.add(entryPoint.id);

    for (let phase = 2; phase <= nodes.length && planned.size < nodes.length; phase++) {
        const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

        for (const currentNode of nodes) {
            if (planned.has(currentNode.id)) {
                // Node already planned
                continue;
            }

            // Check if all dependencies (incomers) are planned
            const incomers = getIncomers(currentNode, nodes, edges);
            const allDependenciesPlanned = incomers.every(incomer => planned.has(incomer.id));

            if (!allDependenciesPlanned) {
                // Skip this node for now, as not all dependencies are resolved
                continue;
            }

            // Check for invalid inputs
            const invalidInputs = getInvalidInputs(currentNode, edges, planned);
            if (invalidInputs.length > 0) {
                console.error("Invalid inputs for node:", currentNode.id, invalidInputs);
                inputsWithErrors.push({
                    nodeId:currentNode.id,inputs:invalidInputs,
                })            }

            // Add the node to the next phase
            nextPhase.nodes.push(currentNode);
        }

        // If no nodes were added to the next phase, break to avoid infinite loops
        if (nextPhase.nodes.length === 0) {
            console.error("No nodes added to phase", phase, "Possible cycle detected.");
            throw new Error("Workflow contains a cycle or unresolved dependencies.");
        }

        // Mark nodes in this phase as planned
        for (const node of nextPhase.nodes) {
            planned.add(node.id);
        }

        executionPlan.push(nextPhase);
    }
    if (inputsWithErrors.length > 0) {
    return { 
        error: { 
            type: FlowToExecutionPlanValidationError.INVALID_INPUTS, 
            invalidElements: inputsWithErrors 
        }
    };
}


    return { executionPlan };
}
function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>): string[] {
    const invalidInputs: string[] = [];
    const inputs = TaskRegistry[node.data.type].inputs;

    for (const input of inputs) {
        const inputValue = node.data.inputs?.[input.name];
        const inputValueProvided = inputValue !== undefined && inputValue !== null && inputValue !== "";

        if (inputValueProvided) {
            // Input is provided directly, so it's valid
            continue;
        }

        // Check if the input is provided by an edge
        const incomingEdges = edges.filter(edge => edge.target === node.id);
        const inputLinkedToOutput = incomingEdges.find(edge => edge.targetHandle === input.name);

        if (inputLinkedToOutput) {
            const sourceNodePlanned = planned.has(inputLinkedToOutput.source);
            if (sourceNodePlanned) {
                // Input is provided by a planned node, so it's valid
                continue;
            } else if (!input.required) {
                // Input is not required, so it's valid even if the source node is not planned
                continue;
            }
        }

        // If we reach here, the input is invalid
        invalidInputs.push(input.name);
    }

    return invalidInputs;
}

function getIncomers(node: AppNode, nodes: AppNode[], edges: Edge[]) {
    if (!node.id) return [];
    
    const incomersIds = new Set<string>();
    edges.forEach(edge => {
        if (edge.target === node.id) {
            incomersIds.add(edge.source);
        }
    });
    
    return nodes.filter((n: AppNode) => incomersIds.has(n.id));
}