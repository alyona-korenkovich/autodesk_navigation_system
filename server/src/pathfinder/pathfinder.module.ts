import { Module } from "@nestjs/common";
import { PathfinderService } from "./pathfinder.service";
import { PathfinderController } from "./pathfinder.controller";

@Module({
    providers: [PathfinderService],
    controllers: [PathfinderController],
    exports: [PathfinderService],
})
export class PathfinderModule {}