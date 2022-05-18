import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { FastifyInstrumentation } from "@opentelemetry/instrumentation-fastify";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { NetInstrumentation } from "@opentelemetry/instrumentation-net";
import { PgInstrumentation } from "@opentelemetry/instrumentation-pg";
import { JaegerPropagator } from "@opentelemetry/propagator-jaeger";
import { Resource } from "@opentelemetry/resources";
import { NodeSDK, tracing } from "@opentelemetry/sdk-node";
import {
  ConsoleSpanExporter,
  // SimpleSpanProcessor,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { TypeormInstrumentation } from "opentelemetry-instrumentation-typeorm";

export const initTracing = (config: {
  consoleTracerEnabled: boolean;
  tracingEnabled: boolean;
  serviceName: string;
  env?: string;
  serviceVersion?: string;
}) => {
  const {
    consoleTracerEnabled,
    tracingEnabled,
    serviceName,
    env,
    serviceVersion,
  } = config;
  const provider = new NodeTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]:
        serviceVersion || "undefined",
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: env || "undefined",
    }),
  });

  console.log(`Running tracing for: ${serviceName}`);
  console.log(`Service version is: ${serviceVersion}`);
  console.log(`Tracing environment is: ${env}`);

  const exporter = new JaegerExporter({
    flushTimeout: 2000,
  });

  // Default exporter - to Jaeger/Zipkin
  // TODO: this packages has been installed incorrectly, we must change it in future
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  provider.addSpanProcessor(new BatchSpanProcessor(exporter));

  if (consoleTracerEnabled) {
    console.log("Adding simple console trace exporter");
    // TODO: this packages has been installed incorrectly, we must change it in future
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    provider.addSpanProcessor(
      new BatchSpanProcessor(new ConsoleSpanExporter())
    );
  }

  // required to extend context from external tracing sources
  provider.register({ propagator: new JaegerPropagator() });

  // Initialize the OpenTelemetry APIs to use the BasicTracer bindings
  if (tracingEnabled) {
    provider.register();

    const sdk = new NodeSDK({
      traceExporter: new tracing.ConsoleSpanExporter(),
      instrumentations: [
        new HttpInstrumentation(),
        new TypeormInstrumentation(),
        new PgInstrumentation(),
        new NetInstrumentation(),
        new FastifyInstrumentation(),
      ],
    });

    // initialize the SDK and register with the OpenTelemetry API
    // this enables the API to record telemetry
    sdk
      .start()
      .then(() => console.log("Tracing initialized"))
      .catch((error: any) => console.log("Error initializing tracing", error));

    // gracefully shut down the SDK on process exit
    process.on("SIGTERM", () => {
      sdk
        .shutdown()
        .then(() => console.log("Tracing terminated"))
        .catch((error: any) => console.log("Error terminating tracing", error))
        .finally(() => process.exit(0));
    });
  }
};
